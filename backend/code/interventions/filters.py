import django_filters
from rest_framework_gis.filterset import GeoFilterSet
from .models import Intervention

class InterventionFilter(GeoFilterSet):
    status = django_filters.ChoiceFilter(choices=Intervention.Status.choices)
    intervention_type = django_filters.ChoiceFilter(choices=Intervention.InterventionType.choices)
    organization = django_filters.NumberFilter(field_name='organization_id')
    
    # Optional date range filtering
    start_date_after = django_filters.DateFilter(field_name='start_date', lookup_expr='gte')
    end_date_before = django_filters.DateFilter(field_name='end_date', lookup_expr='lte')

    class Meta:
        model = Intervention
        fields = ['status', 'intervention_type', 'organization', 'start_date_after', 'end_date_before']