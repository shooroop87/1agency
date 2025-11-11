from django.conf import settings
from django.contrib import admin
from django.urls import path, include, re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
]

from django.conf.urls.static import static

# Раздаём статические и медиа-файлы из /static и /media
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Django Browser Reload (горячая перезагрузка)
if "django_browser_reload" in settings.INSTALLED_APPS:
    urlpatterns += [path("__reload__/", include("django_browser_reload.urls"))]


# Обработчики ошибок
handler404 = "core.views.custom_404"
handler500 = "core.views.custom_500"
