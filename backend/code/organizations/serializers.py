from rest_framework import serializers
from .models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    """
    Serializer for managing Organization records.
    """
    org_type_display = serializers.CharField(source="get_org_type_display", read_only=True)

    class Meta:
        model = Organization
        fields = [
            "id",
            "name",
            "code",
            "org_type",
            "org_type_display",
            "description",
            "website",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]