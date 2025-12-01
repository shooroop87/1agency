# backend/core/context_processors.py
from django.conf import settings
from .models import SiteSettings


def site_settings(request):
    """Глобальные настройки сайта для всех шаблонов"""
    return {
        'site_settings': SiteSettings.load(),
        'LANGUAGES': settings.LANGUAGES,
        'current_language': request.LANGUAGE_CODE,
    }
