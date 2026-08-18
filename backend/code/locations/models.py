import uuid
from django.contrib.gis.db import models as gis_models
from django.db import models
from django.utils.translation import gettext_lazy as _

class AdminLevelChoices(models.IntegerChoices):
    GOVERNORATE = 1, _("Governorate / Level 1")
    DISTRICT = 2, _("District / Level 2")
    SUBDISTRICT = 3, _("Subdistrict / Level 3")


class AdministrativeUnit(gis_models.Model):
    """
    Hierarchical administrative unit boundaries (Governorates, Districts, Subdistricts).
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("Administrative Unit ID")
    )
    name = models.CharField(
        max_length=150,
        verbose_name=_("Name")
    )
    code = models.CharField(
        max_length=50,
        unique=True,
        null=True,
        blank=True,
        verbose_name=_("Code")
    )
    level = models.IntegerField(
        choices=AdminLevelChoices.choices,
        default=AdminLevelChoices.GOVERNORATE,
        db_index=True,
        verbose_name=_("Level")
    )
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
        verbose_name=_("Parent Unit")
    )
    geometry = gis_models.MultiPolygonField(
        srid=4326,
        verbose_name=_("Geometry")
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Created At")
    )

    class Meta:
        ordering = ["level", "name"]

    def __str__(self):
        return f"{self.name} (Level {self.level})"