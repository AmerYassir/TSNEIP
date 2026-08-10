import uuid
from django.contrib.gis.db import models as gis_models
from django.db import models


class AdminLevelChoices(models.IntegerChoices):
    GOVERNORATE = 1, "Governorate / Level 1"
    DISTRICT = 2, "District / Level 2"
    SUBDISTRICT = 3, "Subdistrict / Level 3"


class AdministrativeUnit(gis_models.Model):
    """
    Hierarchical administrative unit boundaries (Governorates, Districts, Subdistricts).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=50, unique=True, null=True, blank=True)
    level = models.IntegerField(
        choices=AdminLevelChoices.choices, 
        default=AdminLevelChoices.GOVERNORATE,
        db_index=True
    )
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children"
    )
    geometry = gis_models.MultiPolygonField(srid=4326)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["level", "name"]

    def __str__(self):
        return f"{self.name} (Level {self.level})"