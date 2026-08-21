from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class ArticleCategory(models.Model):
    name_ar = models.CharField(_("Name (Arabic)"), max_length=100)
    name_en = models.CharField(_("Name (English)"), max_length=100)
    slug = models.SlugField(_("Slug"), max_length=100, unique=True)

    class Meta:
        verbose_name = _("Article Category")
        verbose_name_plural = _("Article Categories")

    def __str__(self):
        return self.name_en


class Article(models.Model):
    title_ar = models.CharField(_("Title (Arabic)"), max_length=255)
    title_en = models.CharField(_("Title (English)"), max_length=255)
    slug = models.SlugField(_("Slug"), max_length=255, unique=True)
    summary_ar = models.TextField(_("Summary (Arabic)"), blank=True)
    summary_en = models.TextField(_("Summary (English)"), blank=True)
    content_ar = models.TextField(_("Content (Arabic)"))
    content_en = models.TextField(_("Content (English)"))
    category = models.ForeignKey(
        ArticleCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="articles",
        verbose_name=_("Category")
    )
    featured_image = models.ImageField(_("Featured Image"), upload_to="articles/images/", null=True, blank=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="articles",
        verbose_name=_("Author")
    )
    is_published = models.BooleanField(_("Is Published"), default=False)
    published_at = models.DateTimeField(_("Published At"), null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Article")
        verbose_name_plural = _("Articles")
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title_en


class Publication(models.Model):
    title_ar = models.CharField(_("Title (Arabic)"), max_length=255)
    title_en = models.CharField(_("Title (English)"), max_length=255)
    summary_ar = models.TextField(_("Summary (Arabic)"), blank=True)
    summary_en = models.TextField(_("Summary (English)"), blank=True)
    file = models.FileField(_("PDF Document"), upload_to="publications/files/")
    cover_image = models.ImageField(_("Cover Image"), upload_to="publications/covers/", null=True, blank=True)
    published_at = models.DateField(_("Publication Date"))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Publication / Report")
        verbose_name_plural = _("Publications / Reports")
        ordering = ["-published_at"]

    def __str__(self):
        return self.title_en