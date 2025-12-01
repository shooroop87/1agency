# backend/properties/models.py
from django.db import models
from django.utils.translation import gettext_lazy as _
from parler.models import TranslatableModel, TranslatedFields
from filer.fields.image import FilerImageField


class PropertyType(models.Model):
    """Apartment 1bd, Villa 3bd, etc."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = _('Property Type')
        verbose_name_plural = _('Property Types')
    
    def __str__(self):
        return self.name


class Location(models.Model):
    """Canggu, Bukit, Ubud, etc."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = _('Location')
        verbose_name_plural = _('Locations')
    
    def __str__(self):
        return self.name


class Developer(models.Model):
    """Застройщик"""
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(unique=True)
    website = models.URLField(blank=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = _('Developer')
        verbose_name_plural = _('Developers')
    
    def __str__(self):
        return self.name


class Property(TranslatableModel):
    """Основная модель объекта недвижимости"""
    
    STATUS_CHOICES = [
        ('off_plan', _('Off-plan')),
        ('construction', _('Under Construction')),
        ('ready', _('Ready')),
    ]
    
    translations = TranslatedFields(
        title=models.CharField(_('Title'), max_length=300),
        description=models.TextField(_('Description'), blank=True),
    )
    
    # Relations
    developer = models.ForeignKey(Developer, on_delete=models.SET_NULL, null=True, blank=True)
    property_type = models.ForeignKey(PropertyType, on_delete=models.SET_NULL, null=True, blank=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Pricing
    price = models.DecimalField(_('Price $'), max_digits=12, decimal_places=2, null=True, blank=True)
    price_per_sqm = models.DecimalField(_('Price per m²'), max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Size
    bedrooms = models.PositiveIntegerField(_('Bedrooms'), null=True, blank=True)
    total_area = models.DecimalField(_('Total area m²'), max_digits=10, decimal_places=2, null=True, blank=True)
    living_area = models.DecimalField(_('Living area m²'), max_digits=10, decimal_places=2, null=True, blank=True)
    plot_area = models.DecimalField(_('Plot area m²'), max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Status & Dates
    status = models.CharField(_('Status'), max_length=20, choices=STATUS_CHOICES, default='off_plan')
    completion_year = models.PositiveIntegerField(_('Completion Year'), null=True, blank=True)
    completion_quarter = models.CharField(_('Quarter'), max_length=10, blank=True)
    
    # Investment
    roi = models.DecimalField(_('ROI %'), max_digits=5, decimal_places=2, null=True, blank=True)
    leasehold_years = models.PositiveIntegerField(_('Leasehold Years'), null=True, blank=True)
    
    # Features
    view = models.CharField(_('View'), max_length=200, blank=True)
    facilities = models.TextField(_('Facilities'), blank=True)
    
    # Media
    image = FilerImageField(verbose_name=_('Main Image'), blank=True, null=True, 
                            on_delete=models.SET_NULL, related_name='property_images')
    video_url = models.URLField(_('Video URL'), blank=True)
    presentation_ru = models.URLField(_('Presentation RU'), blank=True)
    presentation_en = models.URLField(_('Presentation EN'), blank=True)
    
    # Meta
    is_active = models.BooleanField(_('Active'), default=True)
    is_featured = models.BooleanField(_('Featured'), default=False)
    order = models.PositiveIntegerField(_('Order'), default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = _('Property')
        verbose_name_plural = _('Properties')
    
    def __str__(self):
        return self.safe_translation_getter('title', default=f'Property #{self.pk}')
    
    def get_price_range(self):
        """For filter display"""
        if not self.price:
            return None
        p = int(self.price)
        if p < 100000: return 'up_to_100k'
        if p < 150000: return '100k_150k'
        if p < 200000: return '150k_200k'
        if p < 300000: return '200k_300k'
        if p < 500000: return '300k_500k'
        if p < 700000: return '500k_700k'
        if p < 1000000: return '700k_1m'
        return 'over_1m'