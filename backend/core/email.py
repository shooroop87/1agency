# backend/core/email.py
import logging
from django.conf import settings
from django.template.loader import render_to_string
from pysendpulse.pysendpulse import PySendPulse

logger = logging.getLogger(__name__)


def get_sendpulse_client():
    """Получить клиент SendPulse"""
    return PySendPulse(
        settings.SENDPULSE_API_ID,
        settings.SENDPULSE_API_SECRET,
        'file',
        token_storage='/tmp/'
    )


def send_email(to, subject, body_text, body_html=None):
    """Отправка email через SendPulse API"""
    try:
        spl = get_sendpulse_client()
        
        # Поддержка списка получателей
        if isinstance(to, str):
            recipients = [{'email': to}]
        else:
            recipients = [{'email': email} for email in to]
        
        email_data = {
            'html': body_html or body_text,
            'text': body_text,
            'subject': subject,
            'from': {
                'name': settings.SENDPULSE_FROM_NAME,
                'email': settings.SENDPULSE_FROM_EMAIL,
            },
            'to': recipients,
        }
        
        result = spl.smtp_send_mail(email_data)
        logger.info(f"SendPulse response: {result}")
        return True
        
    except Exception as e:
        logger.error(f"SendPulse error: {e}")
        return False


def send_contact_notification(contact_request):
    """Send notification about new request"""
    subject_map = {
        'contact': 'New contact request from website',
        'callback': 'Callback request',
        'service': 'Service request',
        'faq': 'FAQ question',
    }
    
    subject = subject_map.get(contact_request.request_type, 'New request')
    
    body_text = f"""
Type: {contact_request.get_request_type_display()}
Name: {contact_request.name}
Email: {contact_request.email or '-'}
Phone: {contact_request.phone or '-'}
Property type: {contact_request.property_type or '-'}

Message:
{contact_request.message or '-'}

Date: {contact_request.created_at.strftime('%d.%m.%Y %H:%M')}
    """
    
    body_html = render_to_string('emails/contact_notification.html', {
        'contact': contact_request,
    })
    
    return send_email(
        to=settings.ADMIN_EMAIL,
        subject=subject,
        body_text=body_text,
        body_html=body_html,
    )