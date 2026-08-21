from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import SDGGoal, EcosystemThreatCategory
from .serializers import SDGGoalSerializer, EcosystemThreatCategorySerializer


class SDGGoalViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only endpoint for Sustainable Development Goals (SDGs).
    """
    queryset = SDGGoal.objects.all()
    serializer_class = SDGGoalSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'title_en', 'title_ar']
    ordering_fields = ['number', 'code']


class EcosystemThreatCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only endpoint for standardized ecosystem threat classification taxonomy.
    """
    queryset = EcosystemThreatCategory.objects.all()
    serializer_class = EcosystemThreatCategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['code', 'name_en', 'name_ar']