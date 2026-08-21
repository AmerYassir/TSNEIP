from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AdministrativeUnitViewSet

router = DefaultRouter()
router.register(r"units", AdministrativeUnitViewSet, basename="administrative-unit")

urlpatterns = [
    path("", include(router.urls)),
]