# backend/core/email.py
import logging
from django.conf import settings
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)


def get_email_backend():
    """Определить какой backend использовать"""
    email_backend = getattr(settings, 'EMAIL_BACKEND_TYPE', 'gmail_api')
    return email_backend


def send_email(to, subject, body_text, body_html=None):
    """Универсальная функция отправки email"""
    backend = get_email_backend()
    
    if backend == 'gmail_api':
        from .gmail_service import send_email as gmail_send
        return gmail_send(to, subject, body_text, body_html)
    
    elif backend == 'gmail_oauth':
        from .gmail_oauth import send_email_oauth
        return send_email_oauth(to, subject, body_text, body_html)
    
    elif backend == 'smtp':
        # Fallback на Django SMTP
        from django.core.mail import send_mail
        try:
            send_mail(
                subject=subject,
                message=body_text,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[to],
                html_message=body_html,
                fail_silently=False,
            )
            return True
        except Exception as e:
            logger.error(f"SMTP error: {e}")
            return False
    
    else:
        logger.error(f"Unknown email backend: {backend}")
        return False


def send_contact_notification(contact_request):
    """Отправка уведомления о новой заявке"""
    
    subject_map = {
        'contact': 'Новая заявка с сайта | New contact request',
        'callback': 'Запрос обратного звонка | Callback request',
        'service': 'Запрос услуги | Service request',
        'faq': 'Вопрос из FAQ | FAQ question',
    }
    
    subject = subject_map.get(contact_request.request_type, 'Новая заявка')
    
    # Текстовая версия
    body_text = f"""
Тип заявки: {contact_request.get_request_type_display()}
Имя: {contact_request.name}
Email: {contact_request.email or 'Не указан'}
Телефон: {contact_request.phone or 'Не указан'}
Тип недвижимости: {contact_request.property_type or 'Не указан'}

Сообщение:
{contact_request.message or 'Без сообщения'}

---
Дата: {contact_request.created_at.strftime('%d.%m.%Y %H:%M')}
    """
    
    # HTML версия
    body_html = render_to_string('emails/contact_notification.html', {
        'contact': contact_request,
    })
    
    try:
        result = send_email(
            to=settings.ADMIN_EMAIL,
            subject=subject,
            body_text=body_text,
            body_html=body_html,
        )
        
        if result:
            logger.info(f"Email sent for contact request #{contact_request.id}")
        else:
            logger.warning(f"Email not sent for contact request #{contact_request.id}")
        
        return result
    
    except Exception as e:
        logger.error(f"Failed to send notification for #{contact_request.id}: {e}")
        return False
