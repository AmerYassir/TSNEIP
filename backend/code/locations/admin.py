from django.contrib.gis import admin
from .models import AdministrativeUnit


@admin.register(AdministrativeUnit)
class AdministrativeUnitAdmin(admin.GISModelAdmin):
    """
    GIS Admin configuration for Administrative Boundaries with OpenLayers map widget.
    """
    list_display = ["name", "code", "level", "parent", "created_at"]
    list_filter = ["level", "parent"]
    search_fields = ["name", "code"]
    ordering = ["level", "name"]
    raw_id_fields = ["parent"]
    
    # Optional map widget default settings
    # gis_widget_kwargs = {
    #     'default_zoom': 6,
    # }