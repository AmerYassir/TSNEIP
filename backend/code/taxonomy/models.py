from django.db import models
from django.utils.translation import gettext_lazy as _


class SDGGoal(models.Model):
    code = models.CharField(_("SDG Code"), max_length=10, unique=True, help_text=_("e.g. SDG6, SDG13"))
    number = models.PositiveSmallIntegerField(_("Goal Number"), unique=True)
    title_ar = models.CharField(_("Title (Arabic)"), max_length=255)
    title_en = models.CharField(_("Title (English)"), max_length=255)
    description_ar = models.TextField(_("Description (Arabic)"), blank=True)
    description_en = models.TextField(_("Description (English)"), blank=True)
    color_hex = models.CharField(_("Hex Color Code"), max_length=7, default="#000000")
    icon = models.FileField(_("Icon/Logo"), upload_to="sdg_icons/", null=True, blank=True)

    class Meta:
        verbose_name = _("SDG Goal")
        verbose_name_plural = _("SDG Goals")
        ordering = ["number"]

    def __str__(self):
        return f"{self.code}: {self.title_en}"


class EcosystemThreatCategory(models.Model):
    code = models.CharField(_("Threat Code"), max_length=50, unique=True)
    name_ar = models.CharField(_("Name (Arabic)"), max_length=255)
    name_en = models.CharField(_("Name (English)"), max_length=255)
    description_ar = models.TextField(_("Description (Arabic)"), blank=True)
    description_en = models.TextField(_("Description (English)"), blank=True)

    class Meta:
        verbose_name = _("Ecosystem Threat Category")
        verbose_name_plural = _("Ecosystem Threat Categories")

    def __str__(self):
        return self.name_en