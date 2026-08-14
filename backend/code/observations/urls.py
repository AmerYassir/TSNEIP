from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import GeoObservationViewSet, ObservationSubdomainViewSet, GeoObservationMapViewSet

router = DefaultRouter()
router.register(r"subdomains", ObservationSubdomainViewSet, basename="subdomain")
router.register(r"map", GeoObservationMapViewSet, basename="geo-observation-map")
router.register(r"", GeoObservationViewSet, basename="geo-observation")

urlpatterns = [
    path("", include(router.urls)),
]