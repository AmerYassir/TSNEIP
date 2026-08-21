from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import FormSubmissionViewSet, SurveyFormViewSet

router = DefaultRouter()
router.register(r"forms", SurveyFormViewSet, basename="survey-form")
router.register(r"submissions", FormSubmissionViewSet, basename="form-submission")

urlpatterns = [
    path("", include(router.urls)),
]