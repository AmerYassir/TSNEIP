from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from django.db.models import Count, Avg, Q
from .models import AnalyticsSnapshot
from .serializers import AnalyticsSnapshotSerializer, LiveAnalyticsSummarySerializer


class AnalyticsSnapshotViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Historical periodic analytics rollups for system-wide metrics.
    """
    queryset = AnalyticsSnapshot.objects.all()
    serializer_class = AnalyticsSnapshotSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class LiveAnalyticsSummaryView(APIView):
    """
    Calculates live dashboard KPIs and distributions across spatial observations and survey forms.
    Results are cached in Redis/memory for 15 minutes to reduce database pressure.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        cache_key = "analytics_live_summary"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        # Deferred dynamic import to avoid circular dependencies
        from apps.surveys.models import FormSubmission
        # Assuming Observation model exists in apps.observations
        try:
            from apps.observations.models import Observation
            total_obs = Observation.objects.count()
            verified_obs = Observation.objects.filter(status='verified').count()
            verified_rate = round((verified_obs / total_obs * 100), 2) if total_obs > 0 else 0.0
            avg_ndvi = Observation.objects.aggregate(avg=Avg('metrics__ndvi'))['avg'] or 0.0
            critical_hotspots = Observation.objects.filter(threat_level='critical').count()

            governorates = list(
                Observation.objects.values('governorate')
                .annotate(count=Count('id'))
                .order_by('-count')
            )
            sdg_dist = list(
                Observation.objects.values('sdgs__code', 'sdgs__title_en')
                .annotate(count=Count('id'))
                .order_by('-count')
            )
        except (ImportError, Exception):
            total_obs = 0
            verified_rate = 0.0
            avg_ndvi = 0.0
            critical_hotspots = 0
            governorates = []
            sdg_dist = []

        survey_timeline = list(
            FormSubmission.objects.extra(select={'month': "DATE_TRUNC('month', created_at)"})
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        data = {
            "total_observations": total_obs,
            "verified_rate": verified_rate,
            "avg_ndvi": round(avg_ndvi, 3),
            "critical_hotspots": critical_hotspots,
            "sdg_distribution": sdg_dist,
            "governorate_breakdown": governorates,
            "layer_distribution": [],
            "survey_growth_timeline": survey_timeline,
        }

        serializer = LiveAnalyticsSummarySerializer(data=data)
        serializer.is_valid(raise_exception=True)
        cache.set(cache_key, serializer.data, timeout=60 * 15)  # Cache for 15 mins

        return Response(serializer.data, status=status.HTTP_200_OK)