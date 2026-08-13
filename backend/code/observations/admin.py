from django.contrib.gis import admin
from .models import GeoObservation
from modeltranslation.admin import TabbedTranslationAdmin

@admin.register(GeoObservation)
class GeoObservationAdmin(TabbedTranslationAdmin,admin.GISModelAdmin):
    """
    GIS Admin configuration for GeoObservations.
    """
    list_display = ["id", "title", "location", "admin_unit", "created_at"]
    list_filter = ["admin_unit"]
    search_fields = ["title", "description"]
    raw_id_fields = ["admin_unit"]