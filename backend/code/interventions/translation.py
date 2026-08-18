from modeltranslation.translator import register, TranslationOptions
from .models import Intervention

@register(Intervention)
class InterventionTranslationOptions(TranslationOptions):
    fields = ('title', 'description')