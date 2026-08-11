# observations/models.py

import uuid
from django.contrib.gis.db import models as gis_models
from django.db import models
from django.db.models import Q
from django.utils.translation import gettext_lazy as _

class DomainChoices(models.TextChoices):
    WATER = "WATER", _("Water Resources")
    AIR = "AIR", _("Air & Climate")
    SOIL = "SOIL", _("Soil & Land")
    ECOLOGY = "ECOLOGY", _("Ecology & Vegetation")
    URBAN = "URBAN", _("Urban & Waste")


class ObservationSubdomain(models.Model):
    """
    Subdomain categorization lookup with pre-configured parameter definitions.
    """
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False,
        verbose_name=_("Subdomain ID")
    )
    domain = models.CharField(
        max_length=50,
        choices=DomainChoices.choices,
        verbose_name=_("Domain")
    )
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_("Subdomain Name")
    )
    sdg_alignment = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text=_("e.g. SDG 6.3.2"),
        verbose_name=_("SDG Alignment")
    )

    # JSON schema defining required/optional metrics for field form generation
    # Example: [{"code": "pH", "label": "pH Level", "unit": "pH", "type": "number", "required": true}]
    metric_template = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ["domain", "name"]
        verbose_name = _("Observation Subdomain")
        verbose_name_plural = _("Observation Subdomains")

    def __str__(self):
        return f"{self.get_domain_display()} -> {self.name}"


class GeoObservation(gis_models.Model):
    """
    Core spatio-temporal observation record.
    """
    class StatusChoices(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        VERIFIED = "VERIFIED", "Verified"
        REJECTED = "REJECTED", "Rejected"
        PENDING = "PENDING", "Pending Review"
        ARCHIVED = "ARCHIVED", "Archived"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    subdomain = models.ForeignKey(
        ObservationSubdomain, 
        on_delete=models.PROTECT, 
        related_name="observations"
    )
    
    # GeoDjango spatial field (EPSG:4326 for standard Lat/Lng)
    location = gis_models.PointField(srid=4326)
    altitude = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    
    observation_time = models.DateTimeField()
    status = models.CharField(
        max_length=20, 
        choices=StatusChoices.choices, 
        default=StatusChoices.DRAFT,
        db_index=True
    )
    
    # Optional auto-resolved location relation (can be set via spatial signal later)
    admin_unit = models.ForeignKey(
        "locations.AdministrativeUnit", 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="observations"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-observation_time"]
        verbose_name = _("Geo Observation")
        verbose_name_plural = _("Geo Observations")

    def __str__(self):
        return f"{self.title} ({self.subdomain.name})"


class MetricReading(models.Model):
    """
    Individual key-value measurements attached to a GeoObservation.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    observation = models.ForeignKey(
        GeoObservation, 
        on_delete=models.CASCADE, 
        related_name="readings"
    )
    parameter_code = models.CharField(
        max_length=50,
        help_text=_("e.g. pH, NO2, Turbidity"),
        verbose_name=_("Parameter Code")
    )
    numeric_value = models.DecimalField(
        max_digits=12,
        decimal_places=4,
        null=True,
        blank=True,
        verbose_name=_("Numeric Value")
    )
    text_value = models.CharField(
        max_length=255,
        null=True, blank=True,
        verbose_name=_("Text Value")
    )
    unit = models.CharField(
        max_length=30,
        verbose_name=_("Unit")
    )

    class Meta:
        constraints = [
            models.CheckConstraint(
            condition=Q(numeric_value__isnull=False) | Q(text_value__isnull=False),  # ✅ Updated argument
            name="metric_value_not_both_null",
        )
        ]

    def __str__(self):
        val = self.numeric_value if self.numeric_value is not None else self.text_value
        return f"{self.parameter_code}: {val} {self.unit}"