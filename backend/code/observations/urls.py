from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import GeoObservationViewSet, ObservationSubdomainViewSet

router = DefaultRouter()
router.register(r"subdomains", ObservationSubdomainViewSet, basename="subdomain")
router.register(r"observations", GeoObservationViewSet, basename="geo-observation")

urlpatterns = [
    path("", include(router.urls)),
]