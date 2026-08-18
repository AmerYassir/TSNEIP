import logging
from rest_framework import permissions, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import AdministrativeUnit
from .serializers import AdministrativeUnitSerializer

logger = logging.getLogger("monitoring")


class AdministrativeUnitViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only API endpoint to fetch administrative units and boundary hierarchies.
    """
    queryset = AdministrativeUnit.objects.select_related("parent").all()
    serializer_class = AdministrativeUnitSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["name", "code"]
    ordering_fields = ["level", "name"]

    def get_queryset(self):
        queryset = super().get_queryset()
        level = self.request.query_params.get("level")
        parent_id = self.request.query_params.get("parent")

        if level:
            queryset = queryset.filter(level=level)
        if parent_id:
            queryset = queryset.filter(parent_id=parent_id)

        return queryset