from django.contrib.gis import admin
from .models import GeoObservation, ObservationSubdomain
from modeltranslation.admin import TabbedTranslationAdmin
from guardian.admin import GuardedModelAdmin

@admin.register(GeoObservation)
class GeoObservationAdmin(TabbedTranslationAdmin,GuardedModelAdmin,admin.GISModelAdmin):
    """
    GIS Admin configuration for GeoObservations.
    """
    list_display = ["id", "title", "location", "admin_unit", "created_at"]
    list_filter = ["admin_unit","status", "subdomain"]
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