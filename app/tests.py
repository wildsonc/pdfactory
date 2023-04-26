from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from .models import Document, Template


class HtmlToImageTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="test", password="test")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token.key)

    def test_html_to_image(self):
        html_string = "<html><body><h1>Hello, World!</h1></body></html>"
        data = {"html": html_string}
        response = self.client.post(reverse("image"), data=data, format="json")
        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(response["Content-Type"], "image/png")
        self.assertEqual(response["Content-Disposition"], 'attachment; filename="image.png"')


template_data = {
    "name": "Test",
    "html": "<h1>This is a Test!</h1>",
    "css": "",
    "json": "",
    "settings": {
        "footer": False,
        "header": False,
        "page_size": "A4",
        "background": False,
        "margin_top": "40",
        "margin_left": "50",
        "margin_unit": "px",
        "orientation": "portrait",
        "margin_right": "50",
        "margin_bottom": "40",
        "footer_template": "",
        "header_template": "",
        "background_color": "#ffffff",
        "highlight_variables": True,
    },
}


class TemplateTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="test", password="test")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token.key)
        self.data = template_data
        self.template = Template.objects.create(**self.data)

    def test_create_template(self):
        data = self.data
        data["name"] = "Template test"
        response = self.client.post(reverse("templates-list"), data=data, format="json")
        self.assertEqual(response.status_code, 201, response.content)
        self.assertEqual(Template.objects.filter(name="Template test").count(), 1)

    def test_update_template(self):
        data = self.data
        data["html"] = "<h1>Updated!</h1>"
        response = self.client.put(reverse("templates-detail", args=[self.template.pk]), data=data, format="json")
        self.assertEqual(response.status_code, 200, response.content)

    def test_delete_template(self):
        response = self.client.delete(reverse("templates-detail", args=[self.template.pk]))
        self.assertEqual(response.status_code, 204, response.content)
        self.assertEqual(Template.objects.filter(pk=self.template.pk).count(), 0)


class HtmlToPDFTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="test", password="test")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token.key)
        self.data = template_data
        self.data["html"] = "<h1>This is a Test!</h1> {{ VARIABLE }}"
        self.template = Template.objects.create(**self.data)

    def test_html_to_pdf(self):
        data = {"template_id": self.template.pk, "json": {"VARIABLE": "Hello!"}}
        response = self.client.post(reverse("pdf"), data=data, format="json")
        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(response["Content-Type"], "application/pdf")
        self.assertEqual(response["Content-Disposition"], 'attachment; filename="preview.pdf"')
        self.assertEqual(Document.objects.count(), 1)

    def test_html_variables(self):
        data = {
            "template_id": self.template.pk,
            "output_html": True,
            "json": {"VARIABLE": "Hello!", "EXTRA_VARIABLE": "World!"},
        }
        response = self.client.post(reverse("pdf"), data=data, format="json")
        self.assertEqual(response.status_code, 200, response.content)
        self.assertIn("id", response.data)
        self.assertIn("Hello!", response.data["html"])
        self.assertNotIn("World!", response.data["html"])

    def test_base64(self):
        data = {
            "template_id": self.template.pk,
            "output_base64": True,
            "json": {"VARIABLE": "Hello!", "EXTRA_VARIABLE": "World!"},
        }
        response = self.client.post(reverse("pdf"), data=data, format="json")
        self.assertEqual(response.status_code, 200, response.content)
        self.assertIn("id", response.data)
        self.assertIn("base64", response.data)

    def test_all_outputs(self):
        data = {
            "template_id": self.template.pk,
            "output_base64": True,
            "output_html": True,
            "json": {"VARIABLE": "Hello!", "EXTRA_VARIABLE": "World!"},
        }
        response = self.client.post(reverse("pdf"), data=data, format="json")
        self.assertEqual(response.status_code, 200, response.content)
        self.assertIn("id", response.data)
        self.assertIn("base64", response.data)
        self.assertIn("html", response.data)
