import base64
import tempfile
import uuid
from datetime import datetime

from app.models import Document, Font, Template
from app.serializers import (
    DocumentSerializer,
    FontSerializer,
    HtmlToImageSerializer,
    HtmlToPDFSerializer,
    TemplateSerializer,
    UserCreateSerializer,
    UserSerializer,
)
from core.classes import StandardPagination
from django.conf import settings
from django.contrib.auth import logout as django_logout
from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from django.db.models import Count
from django.http import HttpResponse
from django.utils.translation import gettext_lazy as _
from imgkit import from_string
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models.functions import TruncDate
from .utils import build_html, build_pdf
from collections import defaultdict


class TemplateViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TemplateSerializer
    queryset = Template.objects.all()


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def create(self, request, format=None):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(**serializer.data)
            # user["first_name"] = request.data["first_name"]
            # user["last_name"] = request.data["last_name"]
            # user.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class FontViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FontSerializer
    queryset = Font.objects.all()


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    pagination_class = StandardPagination
    permission_classes = [IsAuthenticated]
    serializer_class = DocumentSerializer


class Preview(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        start_date = datetime.now()
        settings = request.data["settings"]
        template = request.data["html"]
        css = request.data["css"]
        json = request.data["json"]
        try:
            if settings.get("highlight_variables"):
                # Highlight variables
                template = template.replace("{{", "<mark>{{")
                template = template.replace("}}", "}}</mark>")

            html = build_html(template, settings | json, css="")
            if settings.get("highlight_variables"):
                # Highlight empty values
                mark_style = """
                padding: 2px 5px;
                border-radius: 2px;"""
                html = html.replace("<mark></mark>", f"<mark style='background-color: red; {mark_style}'>NULL</mark>")
                html = html.replace("<mark>", f"<mark style='{mark_style}'>")
            pdf = build_pdf(html, css=css)
            http_response = HttpResponse(pdf, content_type="application/pdf")
            http_response["Content-Disposition"] = 'attachment; filename="preview.pdf"'
            print(datetime.now() - start_date)
            return http_response
        except Exception as e:
            return Response({"message": str(e)}, status=500)


class HtmlToPDFViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        try:
            serializer = HtmlToPDFSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            response = {}
            try:
                template = Template.objects.get(pk=data["template_id"])
            except Template.DoesNotExist:
                return Response({"message": "template not found"}, status=404)

            html = build_html(template.html, template.settings | data["json"], css="")
            pdf = build_pdf(html, css=template.css)
            html = html.replace('<meta charset="UTF-8" />', "")

            obj = Document.objects.create(html=html, template=template)
            only_pdf = True
            # Upload S3
            if data.get("upload"):
                try:
                    obj.file.save(f"{obj.template.name.lower()}.pdf", ContentFile(pdf))
                    obj.refresh_from_db()
                    response["download_path"] = obj.file_url
                    only_pdf = False
                except Exception as e:
                    return Response({"message": "Upload error: " + str(e)}, status=500)
            # Return HTML
            if data.get("output_html"):
                response["html"] = html
                only_pdf = False
            # Return base64
            if data.get("output_base64"):
                encoded_pdf = base64.b64encode(pdf).decode("utf-8")
                response["base64"] = encoded_pdf
                only_pdf = False

            response["id"] = obj.id
            if only_pdf:
                http_response = HttpResponse(pdf, content_type="application/pdf")
                http_response["Content-Disposition"] = 'attachment; filename="preview.pdf"'
                return http_response
            return Response(response)
        except Exception as e:
            return Response({"message": str(e)}, status=500)


class HtmlToImageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = HtmlToImageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        html_string = serializer.validated_data["html"]
        upload = serializer.validated_data.get("upload", False)
        image_bytes = self.html_to_image(html_string)
        response = HttpResponse(content_type="image/png")
        response["Content-Disposition"] = 'attachment; filename="image.png"'
        response.write(image_bytes)

        obj = Document.objects.create(html=html_string)

        # Upload S3
        if upload:
            try:
                obj.file.save(f"{uuid.uuid4()}.png", ContentFile(image_bytes))
                obj.refresh_from_db()
                response_json = {"download_path": obj.file_url}
            except Exception as e:
                response_json = {"message": "Upload error: " + str(e)}
            return Response(response_json, status=200)
        else:
            return response

    def html_to_image(self, html_string):
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_file:
            options = {"format": "png"}
            from_string(html_string, tmp_file.name, options=options)
            tmp_file.close()
            with open(tmp_file.name, "rb") as img_file:
                image_bytes = img_file.read()
        return image_bytes


class TokenView(APIView):
    def get(self, request, format=None):
        obj, c = Token.objects.get_or_create(user=request.user)
        return Response({"token": obj.key})

    def delete(self, request, format=None):
        Token.objects.filter(user=request.user).delete()
        obj = Token.objects.create(user=request.user)
        return Response({"token": obj.key})


class LogoutView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "dj_rest_auth"

    def get(self, request, *args, **kwargs):
        if getattr(settings, "ACCOUNT_LOGOUT_ON_GET", False):
            response = self.logout(request)
        else:
            response = self.http_method_not_allowed(request, *args, **kwargs)

        return self.finalize_response(request, response, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.logout(request)

    def logout(self, request):
        print("custom logout")
        if getattr(settings, "REST_SESSION_LOGIN", True):
            django_logout(request)

        response = Response(
            {"detail": _("Successfully logged out.")},
            status=status.HTTP_200_OK,
        )

        if getattr(settings, "REST_USE_JWT", False):
            # NOTE: this import occurs here rather than at the top level
            # because JWT support is optional, and if `REST_USE_JWT` isn't
            # True we shouldn't need the dependency
            from dj_rest_auth.jwt_auth import unset_jwt_cookies
            from rest_framework_simplejwt.exceptions import TokenError
            from rest_framework_simplejwt.tokens import RefreshToken

            cookie_name = getattr(settings, "JWT_AUTH_COOKIE", None)

            unset_jwt_cookies(response)

            if "rest_framework_simplejwt.token_blacklist" in settings.INSTALLED_APPS:
                # add refresh token to blacklist
                try:
                    token = RefreshToken(request.data["refresh"])
                    token.blacklist()
                except KeyError:
                    response.data = {"detail": _("Refresh token was not included in request data.")}
                    response.status_code = status.HTTP_401_UNAUTHORIZED
                except (TokenError, AttributeError, TypeError) as error:
                    if hasattr(error, "args"):
                        if "Token is blacklisted" in error.args or "Token is invalid or expired" in error.args:
                            response.data = {"detail": _(error.args[0])}
                            response.status_code = status.HTTP_401_UNAUTHORIZED
                        else:
                            response.data = {"detail": _("An error has occurred.")}
                            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

                    else:
                        response.data = {"detail": _("An error has occurred.")}
                        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

            elif not cookie_name:
                message = _(
                    "Neither cookies or blacklist are enabled, so the token "
                    "has not been deleted server side. Please make sure the token is deleted client side.",
                )
                response.data = {"detail": message}
                response.status_code = status.HTTP_200_OK
        return response


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        date_threshold = timezone.now() - timezone.timedelta(days=7)

        data = (
            Document.objects.filter(created_at__gte=date_threshold)
            .annotate(date=TruncDate("created_at"))
            .values("date", "template__name")
            .annotate(total=Count("template"))
            .order_by("date", "-total")
        )

        date_dict = defaultdict(dict)
        for item in data:
            date_str = item["date"].strftime("%Y-%m-%d")
            date_dict[date_str][item["template__name"]] = item["total"]

        bar_chart_data = [{"date": k, **v} for k, v in date_dict.items()]
        data = Template.objects.all()
        templates = [t.name for t in data]
        return Response(
            {
                "bar_chart": bar_chart_data,
                "templates": templates,
                "users": User.objects.count(),
                "documents": Document.objects.count(),
                "fonts": Font.objects.count(),
            }
        )
