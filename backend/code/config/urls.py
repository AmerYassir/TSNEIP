"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf.urls.i18n import i18n_patterns
from django.conf import settings
from django.conf.urls.static import static

api_v1_patterns = [
    path('observations/', include('observations.urls')),
    path('locations/', include('locations.urls')),
    path('organizations/', include('organizations.urls')),
    path('users/', include('users.urls')),
    path('interventions/', include('interventions.urls')),
    path('taxonomy/', include('taxonomy.urls')),
    path('analytics/', include('analytics.urls')),
    path('surveys/', include('surveys.urls')),
    path('content/', include('content.urls')),
]

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),
    path('api/v1/', include(api_v1_patterns)),
]
urlpatterns += i18n_patterns(
    path('admin/', admin.site.urls),
    prefix_default_language=False,
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)