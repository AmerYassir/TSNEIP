from rest_framework import serializers
from .models import ArticleCategory, Article, Publication


class ArticleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleCategory
        fields = ['id', 'name_ar', 'name_en', 'slug']


class ArticleListSerializer(serializers.ModelSerializer):
    category = ArticleCategorySerializer(read_only=True)
    author_name = serializers.ReadOnlyField(source='author.get_full_name')

    class Meta:
        model = Article
        fields = [
            'id',
            'title_ar',
            'title_en',
            'slug',
            'summary_ar',
            'summary_en',
            'category',
            'featured_image',
            'author_name',
            'published_at',
        ]


class ArticleDetailSerializer(serializers.ModelSerializer):
    category = ArticleCategorySerializer(read_only=True)
    author_name = serializers.ReadOnlyField(source='author.get_full_name')

    class Meta:
        model = Article
        fields = [
            'id',
            'title_ar',
            'title_en',
            'slug',
            'summary_ar',
            'summary_en',
            'content_ar',
            'content_en',
            'category',
            'featured_image',
            'author',
            'author_name',
            'is_published',
            'published_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']


class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = [
            'id',
            'title_ar',
            'title_en',
            'summary_ar',
            'summary_en',
            'file',
            'cover_image',
            'published_at',
            'created_at',
        ]