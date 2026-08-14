from django.contrib.gis import admin
from .models import GeoObservation, ObservationSubdomain
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
    readonly_fields = ('status',)

@admin.register(ObservationSubdomain)
class ObservationSubdomainAdmin(TabbedTranslationAdmin,admin.ModelAdmin):
    """
    Admin configuration for ObservationSubdomains.
    """
    list_display = ["id", "domain", "name", "sdg_alignment"]
    list_filter = ["domain"]
    search_fields = ["name", "sdg_alignment"]
    # readonly_fields = ('*',)