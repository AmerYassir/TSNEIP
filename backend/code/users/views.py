from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    UserSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for public account registration.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    API endpoint for JWT login (email + password).
    """
    serializer_class = CustomTokenObtainPairSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for viewing and updating the authenticated user's profile.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user