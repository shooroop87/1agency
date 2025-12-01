# backend/core/views.py
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.utils import translation
from django.conf import settings
from django.views.decorators.http import require_POST
from .models import (
    SiteSettings, Service, Review, Partner, FAQ,
    InvestmentCard, ConciergeService, PopupSettings, ContactRequest
)
from .forms import ContactForm, CallbackForm, ServiceRequestForm, FAQQuestionForm
from .email import send_contact_notification


def home(request):
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


def _save_and_notify(form, request_type):
    """Сохранить заявку и отправить email"""
    contact = form.save(commit=False)
    contact.request_type = request_type
    contact.save()
    
    # Отправляем email асинхронно (в продакшене лучше через Celery)
    send_contact_notification(contact)
    
    return contact


@require_POST
def submit_contact(request):
    """AJAX отправка контактной формы"""
    form = ContactForm(request.POST)
    if form.is_valid():
        _save_and_notify(form, 'contact')
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'errors': form.errors}, status=400)


@require_POST
def submit_callback(request):
    """AJAX отправка формы обратного звонка"""
    form = CallbackForm(request.POST)
    if form.is_valid():
        _save_and_notify(form, 'callback')
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'errors': form.errors}, status=400)


@require_POST
def submit_service(request):
    """AJAX отправка запроса на услугу"""
    form = ServiceRequestForm(request.POST)
    if form.is_valid():
        _save_and_notify(form, 'service')
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'errors': form.errors}, status=400)


@require_POST
def submit_faq_question(request):
    """AJAX отправка вопроса из FAQ"""
    form = FAQQuestionForm(request.POST)
    if form.is_valid():
        _save_and_notify(form, 'faq')
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'errors': form.errors}, status=400)

# views.py
def about(request):
    bali_images = [f'{i:02}' for i in range(1, 17)]
    return render(request, 'pages/about-bali.html', {
        'bali_images': bali_images,
    })

def projects(request):
    from properties.models import Property, PropertyType, Location
    
    # Получаем все активные объекты для начальной загрузки
    properties = Property.objects.filter(is_active=True).select_related(
        'developer', 'property_type', 'location', 'image'
    )[:12]  # Первые 12 для SSR
    
    # Опции фильтров из БД
    context = {
        'properties': properties,
        'property_types': PropertyType.objects.all(),
        'locations': Location.objects.all(),
        'total_count': Property.objects.filter(is_active=True).count(),
    }
    return render(request, "pages/projects.html", context)

def error(request):
    return render(request, "pages/page-error.html")

# --- Кастомные страницы ошибок ---
def custom_404(request, exception):
    # ваш шаблон 404 лежит тут: templates/404/page-error.html
    return render(request, "pages/page-error.html", status=404)

def custom_500(request):
    # можно использовать тот же шаблон или сделать отдельный 500
    return render(request, "pages/page-error.html", status=500)