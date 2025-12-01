# backend/core/models.py
from django.db import models
from django.utils.translation import gettext_lazy as _
from parler.models import TranslatableModel, TranslatedFields
from filer.fields.image import FilerImageField
from tinymce.models import HTMLField
from taggit.managers import TaggableManager


class SiteSettings(TranslatableModel):
    """Общие настройки сайта"""
    translations = TranslatedFields(
        site_name=models.CharField(_('Site name'), max_length=100, default='One Agency'),
        site_description=models.TextField(_('Site description'), blank=True),
        address=models.TextField(_('Address'), blank=True),
    )
    logo = FilerImageField(
        verbose_name=_('Logo'),
        blank=True, null=True,
        on_delete=models.SET_NULL,
        related_name='site_logo'
    )
    logo_mark = FilerImageField(
        verbose_name=_('Logo mark'),
        blank=True, null=True,
        on_delete=models.SET_NULL,
        related_name='site_logo_mark'
    )
    phone = models.CharField(_('Phone'), max_length=50, blank=True)
    email = models.EmailField(_('Email'), blank=True)
    whatsapp = models.CharField(_('WhatsApp'), max_length=50, blank=True)
    instagram_ru = models.URLField(_('Instagram RU'), blank=True)
    instagram_en = models.URLField(_('Instagram EN'), blank=True)

    class Meta:
        verbose_name = _('Site Settings')
        verbose_name_plural = _('Site Settings')

    def __str__(self):
        return self.safe_translation_getter('site_name', default='One Agency')

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Service(TranslatableModel):
    """All our services (Logistics, Housekeeping, Events, Tours)"""
    translations = TranslatedFields(
        title=models.CharField(_('Title'), max_length=200),
        items=models.TextField(_('Service items'), help_text=_('Comma-separated list')),
    )
    image = FilerImageField(
        verbose_name=_('Image'),
        blank=True, null=True,
        on_delete=models.SET_NULL,
        related_name='service_images'
    )
    order = models.PositiveIntegerField(_('Order'), default=0)
    is_active = models.BooleanField(_('Active'), default=True)

    class Meta:
        ordering = ['order']
        verbose_name = _('Service')
        verbose_name_plural = _('All Services')

    def __str__(self):
        return self.safe_translation_getter('title', default='Service')

    def get_items_list(self):
        items = self.safe_translation_getter('items', default='')
        return [item.strip() for item in items.split(',') if item.strip()]

# Продолжение backend/core/models.py

class Review(TranslatableModel):
    """What our clients say"""
    translations = TranslatedFields(
        name=models.CharField(_('Name'), max_length=100),
        title=models.CharField(_('Title'), max_length=300),
        short_text=models.TextField(_('Short text'), help_text=_('Preview for card')),
        full_text=HTMLField(_('Full text'), help_text=_('Full review for modal')),
    )
    order = models.PositiveIntegerField(_('Order'), default=0)
    is_active = models.BooleanField(_('Active'), default=True)
    created_at = models.DateTimeField(_('Created'), auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = _('Review')
        verbose_name_plural = _('Reviews')

    def __str__(self):
        return self.safe_translation_getter('name', default='Review')


class Partner(TranslatableModel):
    """Our partners"""
    translations = TranslatedFields(
        name=models.CharField(_('Name'), max_length=200),
        description=models.TextField(_('Description'), blank=True),
    )
    logo = FilerImageField(
        verbose_name=_('Logo'),
        blank=True, null=True,
        on_delete=models.SET_NULL,
        related_name='partner_logos'
    )
    link = models.URLField(_('Link'), blank=True)
    order = models.PositiveIntegerField(_('Order'), default=0)
    is_active = models.BooleanField(_('Active'), default=True)

    class Meta:
        ordering = ['order']
        verbose_name = _('Partner')
        verbose_name_plural = _('Partners')

    def __str__(self):
        return self.safe_translation_getter('name', default='Partner')


class FAQ(TranslatableModel):
    """Most popular questions"""
    translations = TranslatedFields(
        question=models.TextField(_('Question')),
        answer=HTMLField(_('Answer')),
    )
    order = models.PositiveIntegerField(_('Order'), default=0)
    is_active = models.BooleanField(_('Active'), default=True)
    tags = TaggableManager(blank=True)

    class Meta:
        ordering = ['order']
        verbose_name = _('FAQ')
        verbose_name_plural = _('FAQs')

    def __str__(self):
        return self.safe_translation_getter('question', default='FAQ')[:100]
    
# Продолжение backend/core/models.py

class InvestmentCard(TranslatableModel):
    """Investment strategies cards (About us section)"""
    translations = TranslatedFields(
        title=models.CharField(_('Title'), max_length=200),
        description=models.TextField(_('Description')),
    )
    icon = FilerImageField(
        verbose_name=_('Icon'),
        blank=True, null=True,
        on_delete=models.SET_NULL,
        related_name='investment_icons'
    )
    icon_svg = models.TextField(_('Icon SVG'), blank=True, help_text=_('SVG code for icon'))
    order = models.PositiveIntegerField(_('Order'), default=0)
    is_active = models.BooleanField(_('Active'), default=True)

    class Meta:
        ordering = ['order']
        verbose_name = _('Investment Card')
        verbose_name_plural = _('Investment Cards')

    def __str__(self):
        return self.safe_translation_getter('title', default='Card')


class ConciergeService(TranslatableModel):
    """Concierge service in Bali items"""
    translations = TranslatedFields(
        title=models.CharField(_('Title'), max_length=200),
        description=models.TextField(_('Description')),
    )
    image = FilerImageField(
        verbose_name=_('Image'),
        blank=True, null=True,
        on_delete=models.SET_NULL,
        related_name='concierge_images'
    )
    order = models.PositiveIntegerField(_('Order'), default=0)
    is_active = models.BooleanField(_('Active'), default=True)

    class Meta:
        ordering = ['order']
        verbose_name = _('Concierge Service')
        verbose_name_plural = _('Concierge Services')

    def __str__(self):
        return self.safe_translation_getter('title', default='Concierge')


class PopupSettings(TranslatableModel):
    """Popup modal settings"""
    POPUP_TYPES = [
        ('callback', _('Callback Modal')),
        ('service', _('Service Request Modal')),
        ('faq', _('FAQ Question Modal')),
    ]
    
    translations = TranslatedFields(
        title=models.CharField(_('Title'), max_length=300),
        subtitle=models.CharField(_('Subtitle'), max_length=500, blank=True),
        button_text=models.CharField(_('Button text'), max_length=100, default='Send'),
        success_title=models.CharField(_('Success title'), max_length=200, default='Thank you!'),
        success_message=models.TextField(_('Success message'), default='Your request has been successfully submitted.'),
    )
    popup_type = models.CharField(_('Type'), max_length=20, choices=POPUP_TYPES, unique=True)
    is_active = models.BooleanField(_('Active'), default=True)

    class Meta:
        verbose_name = _('Popup Settings')
        verbose_name_plural = _('Popup Settings')

    def __str__(self):
        return self.get_popup_type_display()
    
# Продолжение backend/core/models.py

class ContactRequest(models.Model):
    """Contact form submissions"""
    REQUEST_TYPES = [
        ('contact', _('Contact Form')),
        ('callback', _('Callback Request')),
        ('service', _('Service Request')),
        ('faq', _('FAQ Question')),
    ]
    
    request_type = models.CharField(_('Type'), max_length=20, choices=REQUEST_TYPES, default='contact')
    name = models.CharField(_('Name'), max_length=200)
    email = models.EmailField(_('Email'), blank=True)
    phone = models.CharField(_('Phone'), max_length=50, blank=True)
    message = models.TextField(_('Message'), blank=True)
    property_type = models.CharField(_('Property type'), max_length=100, blank=True)
    is_processed = models.BooleanField(_('Processed'), default=False)
    admin_notes = models.TextField(_('Admin notes'), blank=True)
    created_at = models.DateTimeField(_('Created'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated'), auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Contact Request')
        verbose_name_plural = _('Contact Requests')

    def __str__(self):
        return f"{self.get_request_type_display()}: {self.name}"


class SEOSettings(TranslatableModel):
    """SEO settings for pages"""
    PAGE_CHOICES = [
        ('home', _('Home Page')),
        ('about', _('About Page')),
        ('contacts', _('Contacts Page')),
    ]
    
    translations = TranslatedFields(
        meta_title=models.CharField(_('Meta title'), max_length=200, blank=True),
        meta_description=models.TextField(_('Meta description'), blank=True),
        meta_keywords=models.CharField(_('Meta keywords'), max_length=500, blank=True),
        og_title=models.CharField(_('OG title'), max_length=200, blank=True),
        og_description=models.TextField(_('OG description'), blank=True),
    )
    page = models.CharField(_('Page'), max_length=50, choices=PAGE_CHOICES, unique=True)
    og_image = FilerImageField(
        verbose_name=_('OG Image'),
        blank=True, null=True,
        on_delete=models.SET_NULL,
        related_name='seo_og_images'
    )

    class Meta:
        verbose_name = _('SEO Settings')
        verbose_name_plural = _('SEO Settings')

    def __str__(self):
        return self.get_page_display()
    
