# backend/properties/urls.py
from django.urls import path
from . import views
from .views import CompareView

app_name = 'properties'

urlpatterns = [
    path('api/properties/', views.property_list, name='api_list'),
    path('api/properties/<int:pk>/', views.property_detail, name='api_detail'),
    path('api/filters/', views.filter_options, name='api_filters'),
    path('compare/', CompareView.as_view(), name='compare'),
]