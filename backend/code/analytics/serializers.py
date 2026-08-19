from rest_framework import serializers
from .models import AnalyticsSnapshot


class AnalyticsSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsSnapshot
        fields = [
            'id',
            'snapshot_date',
            'total_observations',
            'verified_observations',
            'avg_ndvi',
            'critical_hotspots',
            'governorate_breakdown',
            'sdg_distribution',
            'layer_distribution',
        ]


class LiveAnalyticsSummarySerializer(serializers.Serializer):
    """
    Non-model serializer for real-time aggregated dashboard telemetry.
    """
    total_observations = serializers.IntegerField()
    verified_rate = serializers.FloatField()
    avg_ndvi = serializers.FloatField()
    critical_hotspots = serializers.IntegerField()
    sdg_distribution = serializers.ListField(child=serializers.DictField())
    governorate_breakdown = serializers.ListField(child=serializers.DictField())
    layer_distribution = serializers.ListField(child=serializers.DictField())
    survey_growth_timeline = serializers.ListField(child=serializers.DictField())