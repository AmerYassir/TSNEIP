from django.contrib.gis.geos import Point
from django.db import transaction
from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import GeoObservation, MetricReading, ObservationSubdomain
from django.utils.translation import gettext_lazy as _

class ObservationSubdomainSerializer(serializers.ModelSerializer):
    """
    Lookup serializer used by the frontend to populate cascading dropdowns
    and render dynamic metric form inputs.
    """
    domain_display = serializers.CharField(source="get_domain_display", read_only=True)

    class Meta:
        model = ObservationSubdomain
        fields = [
            "id",
            "domain",
            "domain_display",
            "name",
            "sdg_alignment",
            "metric_template",
        ]
        read_only_fields = ('status',)


class MetricReadingSerializer(serializers.ModelSerializer):
    """
    Serializer for individual parameter measurements.
    """
    class Meta:
        model = MetricReading
        fields = ["id", "parameter_code", "numeric_value", "text_value", "unit"]

    def validate(self, attrs):
        if attrs.get("numeric_value") is None and not attrs.get("text_value"):
            raise serializers.ValidationError(
                _("Either 'numeric_value' or 'text_value' must be provided for each reading.")
            )
        return attrs


class GeoObservationSerializer(serializers.ModelSerializer):
    """
    Atomic creation serializer handling Point conversion and nested bulk readings.
    """
    readings = MetricReadingSerializer(many=True, required=False)
    
    # Write-only coordinate fields simplify payload parsing for mobile & web forms
    latitude = serializers.FloatField(write_only=True, min_value=-90.0, max_value=90.0)
    longitude = serializers.FloatField(write_only=True, min_value=-180.0, max_value=180.0)
    
    # Read-only nested metadata for API responses
    subdomain_detail = ObservationSubdomainSerializer(source="subdomain", read_only=True)

    class Meta:
        model = GeoObservation
        fields = [
            "id",
            "title",
            "subdomain",
            "subdomain_detail",
            "latitude",
            "longitude",
            "altitude",
            "observation_time",
            "status",
            "readings",
            "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def create(self, validated_data):
        readings_data = validated_data.pop("readings", [])
        lat = validated_data.pop("latitude")
        lng = validated_data.pop("longitude")
        
        # PostGIS requires Point(x, y) -> Point(longitude, latitude)
        validated_data["location"] = Point(lng, lat, srid=4326)

        # Ensure observation and nested readings are created atomically
        with transaction.atomic():
            observation = GeoObservation.objects.create(**validated_data)
            
            if readings_data:
                metric_instances = [
                    MetricReading(observation=observation, **reading)
                    for reading in readings_data
                ]
                MetricReading.objects.bulk_create(metric_instances)

        return observation

class GeoObservationGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = GeoObservation
        geo_field = 'location'
        fields = ('id', 'status', 'observation_time', 'created_at')