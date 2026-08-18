from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from organizations.serializers import OrganizationSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing and updating user profiles.
    """
    organization_detail = OrganizationSerializer(source="organization", read_only=True)
    role_display = serializers.CharField(source="get_role_display", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "organization",
            "organization_detail",
            "role",
            "role_display",
            "is_active",
            "date_joined",
        ]
        read_only_fields = ["id", "is_active", "date_joined"]


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for registering new user accounts.
    """
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "organization",
            "role",
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            organization=validated_data.get("organization"),
            role=validated_data.get("role", User.role.field.default),
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT login serializer that includes basic user profile data in the response.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        # Add nested user info alongside 'access' and 'refresh' keys
        data["user"] = UserSerializer(self.user).data
        return data