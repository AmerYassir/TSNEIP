from modeltranslation.translator import register, TranslationOptions
from .models import Organization


@register(Organization)
class OrganizationTranslationOptions(TranslationOptions):
    """
    Registers translated fields for the Organization model.
    Generates: name_en, name_ar, description_en, description_ar
    """
    fields = ('name', 'description')