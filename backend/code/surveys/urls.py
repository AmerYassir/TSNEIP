from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import SurveyForm, FormSubmission
from .serializers import (
    SurveyFormSerializer,
    FormSubmissionGeoSerializer,
    FormSubmissionCreateSerializer,
)


class SurveyFormViewSet(viewsets.ModelViewSet):
    """
    Manage dynamic survey schemas and dynamic field collection definitions.
    """
    queryset = SurveyForm.objects.all()
    serializer_class = SurveyFormSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active', 'version']
    search_fields = ['title_en', 'title_ar', 'slug']
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'active']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Returns only currently active forms for public survey listing."""
        active_forms = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_forms, many=True)
        return Response(serializer.data)


class FormSubmissionViewSet(viewsets.ModelViewSet):
    """
    Handles submission of survey responses and verification workflows.
    """
    queryset = FormSubmission.objects.all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['form', 'status']
    ordering_fields = ['created_at']

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return FormSubmissionCreateSerializer
        return FormSubmissionGeoSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]  # Public crowd-sourcing submission
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(submitted_by=user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        """Marks a submission as verified."""
        submission = self.get_object()
        submission.status = FormSubmission.Status.VERIFIED
        submission.save()
        return Response({'status': 'Form submission marked as verified.'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        """Marks a submission as rejected."""
        submission = self.get_object()
        submission.status = FormSubmission.Status.REJECTED
        submission.save()
        return Response({'status': 'Form submission rejected.'})