from django.urls import path
from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter(trailing_slash=False)
router.register(r"templates", views.TemplateViewSet, basename="templates")
router.register(r"documents", views.DocumentViewSet, basename="documents")
router.register(r"fonts", views.FontViewSet, basename="fonts")
router.register(r"users", views.UserViewSet, basename="users")

urlpatterns = [
    path("create", views.HtmlToPDFViewSet.as_view(), name="create"),
    path("dashboard", views.DashboardView.as_view(), name="dashboard"),
    path("image", views.HtmlToImageView.as_view(), name="image"),
    path("pdf", views.HtmlToPDFViewSet.as_view(), name="pdf"),
    path("preview", views.Preview.as_view(), name="preview"),
    path("token", views.TokenView.as_view(), name="token"),
]

urlpatterns += router.urls
