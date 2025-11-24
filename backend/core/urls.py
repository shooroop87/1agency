from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about-bali/', views.about, name='about'),
    path('projects/', views.projects, name='projects'),
    path('error/', views.error, name='error'),
]