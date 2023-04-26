from django.db import models
from django.core.files.storage import default_storage


class Template(models.Model):
    name = models.CharField(max_length=100)
    html = models.TextField()
    css = models.TextField(null=True, blank=True)
    json = models.JSONField(null=True, blank=True)
    settings = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "templates"
        ordering = ["created_at"]

    def __str__(self):
        return self.name


class Document(models.Model):
    template = models.ForeignKey(Template, on_delete=models.SET_NULL, null=True)
    html = models.TextField(null=True)
    file = models.FileField(upload_to="documents", null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "documents"
        ordering = ["-created_at"]

    @property
    def file_url(self):
        try:
            url = default_storage.url(name=self.file.file.name)
            return url
        except Exception as e:
            pass
        return ""


class Font(models.Model):
    name = models.CharField(max_length=254)
    url = models.URLField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
