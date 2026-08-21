from rest_framework import serializers
from .models import SDGGoal, EcosystemThreatCategory


class SDGGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDGGoal
        fields = [
            'id',
            'code',
            'number',
            'title_ar',
            'title_en',
            'description_ar',
            'description_en',
            'color_hex',
            'icon',
        ]


class EcosystemThreatCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EcosystemThreatCategory
        fields = [
            'id',
            'code',
            'name_ar',
            'name_en',
            'description_ar',
            'description_en',
        ]