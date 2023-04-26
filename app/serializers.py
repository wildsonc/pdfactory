from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Document, Font, Template


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ["password"]


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = "__all__"


class FontSerializer(serializers.ModelSerializer):
    class Meta:
        model = Font
        fields = "__all__"


class DocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.ReadOnlyField()
    template = serializers.ReadOnlyField(source="template.name")

    class Meta:
        model = Document
        fields = "__all__"


class HtmlToImageSerializer(serializers.Serializer):
    html = serializers.CharField(required=True)
    upload = serializers.BooleanField(required=False)


class HtmlToPDFSerializer(serializers.Serializer):
    template_id = serializers.IntegerField(required=True)
    json = serializers.JSONField(required=False)
    upload = serializers.BooleanField(required=False)
    output_html = serializers.BooleanField(required=False)
    output_base64 = serializers.BooleanField(required=False)
