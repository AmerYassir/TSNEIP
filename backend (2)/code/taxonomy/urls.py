from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SDGGoalViewSet, EcosystemThreatCategoryViewSet

router = DefaultRouter()
router.register(r'sdgs', SDGGoalViewSet, basename='sdggoal')
router.register(r'threat-categories', EcosystemThreatCategoryViewSet, basename='threatcategory')

urlpatterns = [
    path('', include(router.urls)),
]