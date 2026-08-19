from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleCategoryViewSet, ArticleViewSet, PublicationViewSet

router = DefaultRouter()
router.register(r'categories', ArticleCategoryViewSet, basename='articlecategory')
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'publications', PublicationViewSet, basename='publication')

urlpatterns = [
    path('', include(router.urls)),
]