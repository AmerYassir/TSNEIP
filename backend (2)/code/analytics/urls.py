from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnalyticsSnapshotViewSet, LiveAnalyticsSummaryView

router = DefaultRouter()
router.register(r'snapshots', AnalyticsSnapshotViewSet, basename='analyticssnapshot')

urlpatterns = [
    path('summary/', LiveAnalyticsSummaryView.as_view(), name='analytics-summary'),
    path('', include(router.urls)),
]