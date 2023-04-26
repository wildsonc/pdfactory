from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.shortcuts import render
from django.urls import include, path, re_path
from django.views.static import serve

from app.models import Font
from app.views import LogoutView


def index(request):
    fonts = Font.objects.all()
    return render(request, "base.html", {"debug": settings.DEBUG, "fonts": fonts})


urlpatterns = (
    [
        path("admin/", admin.site.urls),
        path("auth/logout/", LogoutView.as_view()),
        path("auth/", include("dj_rest_auth.urls")),
        path("api/", include("app.urls")),
        re_path(r"^static/(?P<path>.*)$", serve, {"document_root": settings.STATIC_ROOT}),
        re_path(r"^.*$", index),
    ]
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
)
