from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Intervention

class InterventionGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Intervention
        geo_field = 'location'
        fields = (
            'id', 'title', 'description', 'intervention_type',
            'status', 'start_date', 'end_date', 'organization'
        )