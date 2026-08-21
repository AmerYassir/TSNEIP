from modeltranslation.translator import register, TranslationOptions
from .models import AdministrativeUnit


@register(AdministrativeUnit)
class AdministrativeUnitTranslationOptions(TranslationOptions):
    """
    Registers translated fields for the AdministrativeUnit model.
    Generates: name_en, name_ar
    """
    fields = ('name',)