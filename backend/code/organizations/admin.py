import logging
from rest_framework import permissions, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Organization
from .serializers import OrganizationSerializer
from django.utils.translation import gettext_lazy as _
logger = logging.getLogger("monitoring")


class OrganizationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing partner organizations and institutions.
    """
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["name", "code", "description"]
    ordering_fields = ["name", "created_at"]

    def get_queryset(self):
        queryset = super().get_queryset()
        org_type = self.request.query_params.get("org_type")
        is_active = self.request.query_params.get("is_active")

        if org_type:
            queryset = queryset.filter(org_type__iexact=org_type)
        if is_active is not None:
            active_bool = is_active.lower() in ["true", "1"]
            queryset = queryset.filter(is_active=active_bool)

        return queryset

    def perform_create(self, serializer):
        org = serializer.save()
        logger.info(_("Created Organization id={org.id} name='{org.name}' code='{org.code}'".format(org=org)))