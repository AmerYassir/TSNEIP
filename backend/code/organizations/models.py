import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _

class OrgTypeChoices(models.TextChoices):
    NGO = "NGO", _("Non-Governmental Organization")
    GOVERNMENT = "GOVERNMENT", _("Government Agency")
    RESEARCH = "RESEARCH", _("Research & Academic Institution")
    FOUNDATION = "FOUNDATION", _("Environmental Foundation")
    PRIVATE = "PRIVATE", _("Private Enterprise")


class Organization(models.Model):
    """
    Represents partner organizations, research entities, and operational institutions.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name=_("Organization ID"))
    name = models.CharField(
        max_length=255,
        verbose_name=_("Organization Name")
    )
    code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        verbose_name=_("Organization Code")
    )
    org_type = models.CharField(
        max_length=20,
        choices=OrgTypeChoices.choices,
        default=OrgTypeChoices.NGO,
        db_index=True,
        verbose_name=_("Organization Type")
    )
    description = models.TextField(
        blank=True,
        default="",
        verbose_name=_("Description")
    )
    website = models.URLField(
        blank=True,
        default="",
        verbose_name=_("Website")
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Is Active")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = _("Organization")
        verbose_name_plural = _("Organizations")

    def __str__(self):
        return f"{self.name} ({self.code})"