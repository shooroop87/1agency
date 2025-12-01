from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about-bali/', views.about, name='about'),
    path('projects/', views.projects, name='projects'),
    path('error/', views.error, name='error'),
    path('set-language/', views.set_language, name='set_language'),
    path('api/contact/', views.submit_contact, name='submit_contact'),
    path('api/callback/', views.submit_callback, name='submit_callback'),
    path('api/service/', views.submit_service, name='submit_service'),
    path('api/faq-question/', views.submit_faq_question, name='submit_faq_question'),
    
    # Properties API
    path('', include('properties.urls')),
]