from django.db import models
from django.utils.translation import gettext_lazy as _


class AnalyticsSnapshot(models.Model):
    """
    Stores periodic aggregations (daily/weekly rollups) to serve 
    analytics dashboards without recalculating raw spatial data on every request.
    """
    snapshot_date = models.DateField(_("Snapshot Date"), auto_now_add=True, db_index=True)
    total_observations = models.PositiveIntegerField(_("Total Observations"), default=0)
    verified_observations = models.PositiveIntegerField(_("Verified Observations"), default=0)
    avg_ndvi = models.FloatField(_("Average NDVI"), default=0.0)
    critical_hotspots = models.PositiveIntegerField(_("Critical Hotspots Count"), default=0)
    governorate_breakdown = models.JSONField(_("Governorate Breakdown"), default=dict)
    sdg_distribution = models.JSONField(_("SDG Distribution"), default=dict)
    layer_distribution = models.JSONField(_("Layer Distribution"), default=dict)

    class Meta:
        verbose_name = _("Analytics Snapshot")
        verbose_name_plural = _("Analytics Snapshots")
        ordering = ["-snapshot_date"]

    def __str__(self):
        return f"Analytics Snapshot ({self.snapshot_date})"