import logging
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Organization
from .serializers import OrganizationSerializer
from rest_framework.permissions import DjangoObjectPermissions
from guardian.shortcuts import assign_perm, get_objects_for_user

logger = logging.getLogger("monitoring")


class OrganizationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing partner organizations and institutions.
    """
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [DjangoObjectPermissions]
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

        user = self.request.user
        
        # Superusers see all database rows
        if user.is_superuser:
            return Organization.objects.all()

        # Filter and return ONLY the specific rows the user has 'view' permission for
        return get_objects_for_user(
            user,
            'organizations.view_organization',
            klass=Organization,
            accept_global_perms=True  # Ignore table-level permissions if checking strictly row-level
        )

    def perform_create(self, serializer):
        org = serializer.save()
        logger.info(f"Created Organization id={org.id} name='{org.name}' code='{org.code}'")