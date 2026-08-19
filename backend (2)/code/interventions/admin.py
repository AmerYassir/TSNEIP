from django.contrib.gis import admin
from modeltranslation.admin import TabbedTranslationAdmin
from .models import Intervention

@admin.register(Intervention)
class InterventionAdmin(TabbedTranslationAdmin, admin.GISModelAdmin):
    list_display = ('title', 'organization', 'intervention_type', 'status', 'start_date')
    list_filter = ('status', 'intervention_type', 'organization')
    search_fields = ('title_ar', 'title_en', 'description_ar', 'description_en')
    default_zoom = 12