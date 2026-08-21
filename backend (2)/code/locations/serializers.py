from rest_framework import serializers
from .models import AdministrativeUnit


class AdministrativeUnitSerializer(serializers.ModelSerializer):
    """
    Serializer for administrative boundaries.
    """
    parent_name = serializers.CharField(source="parent.name", read_only=True)

    class Meta:
        model = AdministrativeUnit
        fields = [
            "id",
            "name",
            "code",
            "level",
            "parent",
            "parent_name",
            "created_at",
        ]