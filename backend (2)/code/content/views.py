from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import ArticleCategory, Article, Publication
from .serializers import (
    ArticleCategorySerializer,
    ArticleListSerializer,
    ArticleDetailSerializer,
    PublicationSerializer,
)


class ArticleCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Categories for grouping articles and blog posts.
    """
    queryset = ArticleCategory.objects.all()
    serializer_class = ArticleCategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class ArticleViewSet(viewsets.ModelViewSet):
    """
    Manage articles, blog posts, and ecosystem foundation updates.
    """
    queryset = Article.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_published']
    search_fields = ['title_en', 'title_ar', 'summary_en', 'summary_ar']
    ordering_fields = ['published_at', 'created_at']
    lookup_field = 'slug'

    def get_queryset(self):
        # Non-staff users only see published articles
        if self.request.user.is_staff:
            return Article.objects.all()
        return Article.objects.filter(is_published=True)

    def get_serializer_class(self):
        if self.action in ['list']:
            return ArticleListSerializer
        return ArticleDetailSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PublicationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for downloading public ecosystem reports, PDFs, and policy briefs.
    """
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title_en', 'title_ar', 'summary_en', 'summary_ar']
    ordering_fields = ['published_at']