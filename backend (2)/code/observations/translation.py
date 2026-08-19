from modeltranslation.translator import register, TranslationOptions
from .models import GeoObservation


@register(GeoObservation)
class GeoObservationTranslationOptions(TranslationOptions):
    """
    Registers translated fields for the GeoObservation model.
    Generates: title_en, title_ar, subdomain_en, subdomain_ar, status_en, status_ar
    """
    fields = ('title', 'subdomain', 'status')