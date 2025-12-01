# backend/oneagency/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('i18n/', include('django.conf.urls.i18n')),
    path('tinymce/', include('tinymce.urls')),
    path('filer/', include('filer.urls')),
    path('__reload__/', include('django_browser_reload.urls')),
]

urlpatterns += i18n_patterns(
    path('', include('core.urls')),
    prefix_default_language=False,
)

# Обработчики ошибок
handler404 = "core.views.custom_404"
handler500 = "core.views.custom_500"
