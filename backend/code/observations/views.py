import logging
from rest_framework import permissions, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from common.pagination import StandardGeoJsonPagination
from .models import GeoObservation, ObservationSubdomain
from .serializers import GeoObservationSerializer, ObservationSubdomainSerializer, GeoObservationGeoSerializer
from .permissions import CanAccessObservationData,CanExecuteReviewAction, CanManageContentAndReports
from django.db.models import Q

from rest_framework.permissions import DjangoObjectPermissions
from guardian.shortcuts import assign_perm, get_objects_for_user

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
    permission_classes = [DjangoObjectPermissions]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title", "subdomain__name"]
    ordering_fields = ["observation_time", "created_at"]

    def get_queryset(self):
        user = self.request.user
        
        # Superusers see all database rows
        if user.is_superuser:
            return GeoObservation.objects.all()

        # Filter and return ONLY the specific rows the user has 'view' permission for
        return get_objects_for_user(
            user,
            'observations.view_geoobservation',
            klass=GeoObservation,
            accept_global_perms=False  # Ignore table-level permissions if checking strictly row-level
        )

    def perform_create(self, serializer):
        # 1. Save the observation
        observation = serializer.save(created_by=self.request.user)

        # 2. Programmatically assign row-level permissions to the creator
        assign_perm('view_geoobservation', self.request.user, observation)
        assign_perm('change_geoobservation', self.request.user, observation)
        assign_perm('delete_geoobservation', self.request.user, observation)

    @action(detail=True, methods=['post'], permission_classes=[CanExecuteReviewAction])
    def claim(self, request, pk=None):
        observation = self.get_object()
        if observation.status != GeoObservation.StatusChoices.SUBMITTED:
            return Response(
                {"detail": "Only SUBMITTED items can be claimed."},
                status=status.HTTP_400_BAD_REQUEST
            )
        observation.claim(user=request.user)
        return Response({"status": "UNDER_REVIEW", "reviewed_by": request.user.email})

    @action(detail=True, methods=['post'], permission_classes=[CanExecuteReviewAction])
    def approve(self, request, pk=None):
        observation = self.get_object()
        observation.approve(user=request.user)
        return Response({"status": "APPROVED"})

    @action(detail=True, methods=['post'], permission_classes=[CanExecuteReviewAction])
    def reject(self, request, pk=None):
        observation = self.get_object()
        reason = request.data.get("reason", "")
        if not reason:
            return Response(
                {"reason": "A rejection reason is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        observation.reject(user=request.user, reason=reason)
        return Response({"status": "REJECTED", "rejection_reason": reason})
    

class GeoObservationMapViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = GeoObservationGeoSerializer
    pagination_class = StandardGeoJsonPagination

    def get_queryset(self):
        user = self.request.user

        # 1. Anonymous / Guest Users: Only see official APPROVED map features
        if not user or user.is_anonymous:
            return GeoObservation.objects.filter(status='APPROVED')

        # 2. Staff / Admins: Optional check to view everything across all statuses
        if user.is_staff or user.is_superuser:
            return GeoObservation.objects.all()

        # 3. Authenticated Regular Users:
        # See all APPROVED features PLUS their own items regardless of status (DRAFT, SUBMITTED, etc.)
        return GeoObservation.objects.filter(
            Q(status='APPROVED') | Q(created_by=user)
        )