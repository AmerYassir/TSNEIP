from modeltranslation.admin import TabbedTranslationAdmin
from .models import Organization
from django.contrib import admin

@admin.register(Organization)
class OrganizationAdmin(TabbedTranslationAdmin):
    """
    GIS Admin configuration for Organizations with OpenLayers map widget.
    """
    list_display = ["name", "code", "created_at"]
    search_fields = ["name", "code"]
    ordering = ["name"]
    
    # Optional map widget default settings
    # gis_widget_kwargs = {
    #     'default_zoom': 6,
    # }