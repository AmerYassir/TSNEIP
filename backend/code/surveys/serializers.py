from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer, GeometryField
from .models import SurveyForm, FormSubmission


class SurveyFormSerializer(serializers.ModelSerializer):
    created_by_username = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = SurveyForm
        fields = [
            'id',
            'title_ar',
            'title_en',
            'slug',
            'description_ar',
            'description_en',
            'schema',
            'version',
            'is_active',
            'created_by',
            'created_by_username',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class FormSubmissionGeoSerializer(GeoFeatureModelSerializer):
    """
    GeoJSON representation of field submissions for spatial rendering on Leaflet maps.
    """
    submitted_by_username = serializers.ReadOnlyField(source='submitted_by.username')
    form_title = serializers.ReadOnlyField(source='form.title_en')

    class Meta:
        model = FormSubmission
        geo_field = 'location'
        fields = [
            'id',
            'form',
            'form_title',
            'data',
            'status',
            'submitted_by',
            'submitted_by_username',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'submitted_by', 'status', 'created_at', 'updated_at']


class FormSubmissionCreateSerializer(serializers.ModelSerializer):
    """
    Standard serializer for handling incoming JSON submissions with standard GeoJSON geometry or point input.
    """
    location = GeometryField(required=False, allow_null=True)

    class Meta:
        model = FormSubmission
        fields = [
            'id',
            'form',
            'data',
            'location',
            'status',
            'submitted_by',
            'created_at',
        ]
        read_only_fields = ['id', 'status', 'submitted_by', 'created_at']