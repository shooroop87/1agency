# backend/core/views.py
import json

from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.utils import translation
from django.conf import settings
from django.views.decorators.http import require_POST
from .models import (
    SiteSettings, Service, Review, Partner, FAQ,
    InvestmentCard, ConciergeService, PopupSettings, ContactRequest
)
from .forms import ContactForm, CallbackForm, ServiceRequestForm, FAQQuestionForm
from .email import send_contact_notification
from properties.models import PropertyType, Location, Feature


def ping(request):
    return HttpResponse("ok")


def home(request):
    from properties.models import Property

    # Данные для карты - только объекты с координатами и галочкой show_on_map
    map_properties = []
    map_qs = Property.objects.filter(
        is_active=True, 
        show_on_map=True,
        latitude__isnull=False,
        longitude__isnull=False
    ).select_related('location', 'property_type', 'image')

    for prop in map_qs:
        map_properties.append({
            'id': prop.id,
            'title': prop.safe_translation_getter('title', default=''),
            'location': prop.location.name if prop.location else 'Bali',
            'lat': float(prop.latitude),
            'lng': float(prop.longitude),
            'image': prop.image.url if prop.image else '/static/images/placeholder.jpg',
            'type': prop.property_type.name if prop.property_type else '',
            'status': prop.get_sale_status_display(),
            'completion': f"Q{prop.completion_quarter} {prop.completion_year}" if prop.completion_year else '',
            'roi': prop.get_roi_display(),
            'price': prop.get_price_display(),
            'bedrooms': prop.get_bedrooms_display(),
            'area': prop.get_total_area_display(),
        })
    
    # 4 featured проекта для главной
    featured_properties = Property.objects.filter(
        is_active=True
    ).select_related(
        'property_type', 'location', 'image'
    ).order_by('-is_featured', 'order', '-created_at')[:4]
    
    context = {
        'services': Service.objects.filter(is_active=True),
        'reviews': Review.objects.filter(is_active=True),
        'partners': Partner.objects.filter(is_active=True),
        'faqs': FAQ.objects.filter(is_active=True),
        'investment_cards': InvestmentCard.objects.filter(is_active=True),
        'concierge_services': ConciergeService.objects.filter(is_active=True),
        'popup_callback': PopupSettings.objects.filter(popup_type='callback', is_active=True).first(),
        'popup_service': PopupSettings.objects.filter(popup_type='service', is_active=True).first(),
        'popup_faq': PopupSettings.objects.filter(popup_type='faq', is_active=True).first(),
        'contact_form': ContactForm(),
        # Map
        'map_properties': map_properties,
        'map_properties_json': json.dumps(map_properties),
        'show_map_section': len(map_properties) > 0,
        # Featured properties
        'featured_properties': featured_properties,
        'property_types': PropertyType.objects.all(),
        'locations': Location.objects.all(),
        'features': Feature.objects.all(),
    }
    
    return render(request, 'pages/index.html', context)


def set_language(request):
    """Переключение языка"""
    lang = request.POST.get('language', request.GET.get('language', 'en'))
    if lang in dict(settings.LANGUAGES):
        translation.activate(lang)
        response = redirect(request.META.get('HTTP_REFERER', '/'))
        response.set_cookie(settings.LANGUAGE_COOKIE_NAME, lang)
        return response
    return redirect('/')


@require_POST
def submit_contact(request):
    form = ContactForm(request.POST)
    if form.is_valid():
        contact = ContactRequest.objects.create(
            request_type='contact',
            name=form.cleaned_data['name'],
            email=form.cleaned_data.get('email', ''),
            phone=form.cleaned_data.get('phone', ''),
            message=form.cleaned_data.get('message', ''),
            property_type=form.cleaned_data.get('property_type', ''),
        )
        send_contact_notification(contact)
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'errors': form.errors}, status=400)


@require_POST
def submit_callback(request):
    form = CallbackForm(request.POST)
    if form.is_valid():
        contact = ContactRequest.objects.create(
            request_type='callback',
            name=form.cleaned_data['name'],
            phone=form.cleaned_data['phone'],
        )
        send_contact_notification(contact)
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'errors': form.errors}, status=400)


@require_POST
def submit_service(request):
    form = ServiceRequestForm(request.POST)
    if form.is_valid():
        contact = ContactRequest.objects.create(
            request_type='service',
            name=form.cleaned_data['name'],
            phone=form.cleaned_data['phone'],
            email=form.cleaned_data.get('email', ''),
            message=form.cleaned_data.get('message', ''),
        )
        send_contact_notification(contact)
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'errors': form.errors}, status=400)


@require_POST
def submit_faq_question(request):
    form = FAQQuestionForm(request.POST)
    if form.is_valid():
        contact = ContactRequest.objects.create(
            request_type='faq',
            name=form.cleaned_data['name'],
            phone=form.cleaned_data['phone'],
            email=form.cleaned_data.get('email', ''),
            message=form.cleaned_data['message'],
        )
        send_contact_notification(contact)
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'errors': form.errors}, status=400)


def about(request):
    bali_images = [f'{i:02}' for i in range(1, 17)]
    return render(request, 'pages/about-bali.html', {'bali_images': bali_images})


def projects(request):
    from properties.models import Property, PropertyType, Location, Feature
    
    properties = Property.objects.filter(is_active=True).select_related(
        'developer', 'property_type', 'location', 'image'
    ).prefetch_related('features')[:12]
    
    context = {
        'properties': properties,
        'property_types': PropertyType.objects.all(),
        'locations': Location.objects.all(),
        'features': Feature.objects.all(),
        'total_count': Property.objects.filter(is_active=True).count(),
    }
    return render(request, "pages/projects.html", context)


def error(request):
    return render(request, "pages/page-error.html")


def privacy(request):
    return render(request, "pages/privacy-policy.html")


def custom_404(request, exception):
    return render(request, "pages/page-error.html", status=404)


def custom_500(request):
    return render(request, "pages/page-error.html", status=500)


def oauth2callback(request):
    code = request.GET.get("code")
    error = request.GET.get("error")
    if error:
        return HttpResponse(f"Error: {error}")
    return HttpResponse(f"Your auth code: {code}")

def compare(request):
    return render(request, 'properties/compare.html')