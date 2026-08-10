import logging
from rest_framework import permissions, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import GeoObservation, ObservationSubdomain
from .serializers import GeoObservationSerializer, ObservationSubdomainSerializer

logger = logging.getLogger("monitoring")


class ObservationSubdomainViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for field clients to fetch domain/subdomain hierarchies
    and metric templates.
    """
    queryset = ObservationSubdomain.objects.all()
    serializer_class = ObservationSubdomainSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [OrderingFilter]
    ordering_fields = ["domain", "name"]

    def get_queryset(self):
        queryset = super().get_queryset()
        domain = self.request.query_params.get("domain")
        if domain:
            queryset = queryset.filter(domain__iexact=domain)
        return queryset


class GeoObservationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing, submitting, and managing spatio-temporal geo-observations.
    """
    queryset = (
        GeoObservation.objects
        .select_related("subdomain", "admin_unit")
        .prefetch_related("readings")
        .all()
    )
    serializer_class = GeoObservationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title", "subdomain__name"]
    ordering_fields = ["observation_time", "created_at"]

    def get_queryset(self):
        queryset = super().get_queryset()
        subdomain_id = self.request.query_params.get("subdomain")
        status_param = self.request.query_params.get("status")

        if subdomain_id:
            queryset = queryset.filter(subdomain_id=subdomain_id)
        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset

    def perform_create(self, serializer):
        observation = serializer.save()
        logger.info(
            f"Created GeoObservation id={observation.id} "
            f"subdomain='{observation.subdomain.name}' "
            f"readings_count={observation.readings.count()}"
        )