from django.db import models
from django.contrib.gis.db import models as gis_models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class SurveyForm(models.Model):
    title_ar = models.CharField(_("Title (Arabic)"), max_length=255)
    title_en = models.CharField(_("Title (English)"), max_length=255)
    slug = models.SlugField(_("Slug"), max_length=255, unique=True)
    description_ar = models.TextField(_("Description (Arabic)"), blank=True)
    description_en = models.TextField(_("Description (English)"), blank=True)
    schema = models.JSONField(
        _("Form JSON Schema"),
        help_text=_("Defines field names, types, options, and validation rules.")
    )
    version = models.PositiveIntegerField(_("Version"), default=1)
    is_active = models.BooleanField(_("Is Active"), default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_forms",
        verbose_name=_("Created By")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Survey Form")
        verbose_name_plural = _("Survey Forms")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title_en} (v{self.version})"


class FormSubmission(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", _("Pending Review")
        VERIFIED = "verified", _("Verified")
        CONVERTED = "converted", _("Converted to Observation")
        REJECTED = "rejected", _("Rejected")

    form = models.ForeignKey(
        SurveyForm,
        on_delete=models.CASCADE,
        related_name="submissions",
        verbose_name=_("Survey Form")
    )
    data = models.JSONField(_("Submitted Data JSON"))
    location = gis_models.PointField(_("Geographic Location"), srid=4326, null=True, blank=True)
    status = models.CharField(_("Status"), max_length=20, choices=Status.choices, default=Status.PENDING)
    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="survey_submissions",
        verbose_name=_("Submitted By")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Form Submission")
        verbose_name_plural = _("Form Submissions")
        ordering = ["-created_at"]

    def __str__(self):
        return f"Submission #{self.id} - {self.form.title_en}"