import logging
from django.db.models.signals import pre_save
from django.dispatch import receiver
from locations.models import AdministrativeUnit
from .models import GeoObservation

logger = logging.getLogger("monitoring")


@receiver(pre_save, sender=GeoObservation)
def auto_assign_admin_unit(sender, instance, **kwargs):
    """
    PostGIS Spatial Signal:
    Automatically assigns the administrative unit boundary (admin_unit)
    that geographically contains the observation's Point location.
    Prioritizes the most granular boundary (highest level, e.g., Subdistrict).
    """
    if instance.location and not instance.admin_unit_id:
        matching_unit = (
            AdministrativeUnit.objects.filter(geometry__contains=instance.location)
            .order_by("-level")
            .first()
        )
        if matching_unit:
            instance.admin_unit = matching_unit
            logger.info(
                f"Auto-assigned admin_unit '{matching_unit.name}' (Level {matching_unit.level}) "
                f"to GeoObservation '{instance.title}'"
            )