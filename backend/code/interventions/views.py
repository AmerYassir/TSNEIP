from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_gis.filters import InBBoxFilter

from .models import Intervention
from .serializers import InterventionGeoSerializer
from .filters import InterventionFilter

class InterventionViewSet(viewsets.ModelViewSet):
    queryset = Intervention.objects.select_related('organization', 'target_observation').all()
    serializer_class = InterventionGeoSerializer
    
    # Configure backends
    filter_backends = (InBBoxFilter, DjangoFilterBackend)
    filterset_class = InterventionFilter
    
    # Specify geometry column for InBBoxFilter
    bbox_filter_field = 'location'
    bbox_filter_include_overlapping = True  # Includes geometries that cross bbox edges