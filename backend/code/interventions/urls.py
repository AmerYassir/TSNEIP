from rest_framework.routers import DefaultRouter
from .views import InterventionViewSet

router = DefaultRouter()
router.register(r'interventions', InterventionViewSet, basename='intervention')

urlpatterns = router.urls