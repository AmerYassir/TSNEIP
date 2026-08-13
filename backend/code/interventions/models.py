from django.contrib.gis.db import models as gis_models
from django.db import models
from django.utils.translation import gettext_lazy as _

class Intervention(models.Model):
    class Status(models.TextChoices):
        PLANNED = 'PLANNED', _('Planned')
        IN_PROGRESS = 'IN_PROGRESS', _('In Progress')
        COMPLETED = 'COMPLETED', _('Completed')
        SUSPENDED = 'SUSPENDED', _('Suspended')

    class InterventionType(models.TextChoices):
        REFORESTATION = 'REFORESTATION', _('Reforestation / Vegetation')
        WATER_TREATMENT = 'WATER_TREATMENT', _('Water Quality Restoration')
        WASTE_CLEANUP = 'WASTE_CLEANUP', _('Waste & Pollution Removal')
        HABITAT_PROTECTION = 'HABITAT_PROTECTION', _('Habitat & Wildlife Protection')

    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='interventions',
        verbose_name=_('Responsible Organization')
    )
    target_observation = models.ForeignKey(
        'observations.GeoObservation',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='interventions',
        verbose_name=_('Target Geo Observation')
    )
    title = models.CharField(max_length=255, verbose_name=_('Intervention Title'))
    description = models.TextField(verbose_name=_('Description / Scope of Work'))
    intervention_type = models.CharField(
        max_length=30,
        choices=InterventionType.choices,
        verbose_name=_('Intervention Type')
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PLANNED,
        verbose_name=_('Status')
    )
    # Spatial boundary or target location (Polygon or Point)
    location = gis_models.GeometryField(srid=4326, verbose_name=_('Location / Area Geometry'))
    start_date = models.DateField(verbose_name=_('Start Date'))
    end_date = models.DateField(null=True, blank=True, verbose_name=_('End Date'))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Intervention')
        verbose_name_plural = _('Interventions')

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"