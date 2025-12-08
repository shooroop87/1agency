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
    
    # Pricing (ranges)
    price_min = models.DecimalField(_('Price $ from'), max_digits=12, decimal_places=2, null=True, blank=True)
    price_max = models.DecimalField(_('Price $ to'), max_digits=12, decimal_places=2, null=True, blank=True)
    price_per_sqm_min = models.DecimalField(_('Price per m² from'), max_digits=10, decimal_places=2, null=True, blank=True)
    price_per_sqm_max = models.DecimalField(_('Price per m² to'), max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Size (ranges)
    bedrooms_min = models.PositiveIntegerField(_('Bedrooms from'), null=True, blank=True, 
                                                help_text=_('0 = Studio'))
    bedrooms_max = models.PositiveIntegerField(_('Bedrooms to'), null=True, blank=True)
    total_area_min = models.DecimalField(_('Total area m² from'), max_digits=10, decimal_places=2, null=True, blank=True)
    total_area_max = models.DecimalField(_('Total area m² to'), max_digits=10, decimal_places=2, null=True, blank=True)
    living_area_min = models.DecimalField(_('Living area m² from'), max_digits=10, decimal_places=2, null=True, blank=True)
    living_area_max = models.DecimalField(_('Living area m² to'), max_digits=10, decimal_places=2, null=True, blank=True)
    plot_area_min = models.DecimalField(_('Plot area m² from'), max_digits=10, decimal_places=2, null=True, blank=True)
    plot_area_max = models.DecimalField(_('Plot area m² to'), max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Status & Dates
    status = models.CharField(_('Status'), max_length=20, choices=STATUS_CHOICES, default='off_plan')
    completion_year = models.PositiveIntegerField(_('Completion Year'), null=True, blank=True)
    completion_quarter = models.CharField(_('Quarter'), max_length=10, blank=True)
    
    # Investment (ranges)
    roi_min = models.DecimalField(_('ROI % from'), max_digits=5, decimal_places=2, null=True, blank=True)
    roi_max = models.DecimalField(_('ROI % to'), max_digits=5, decimal_places=2, null=True, blank=True)
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

    # Geo
    latitude = models.DecimalField(_('Latitude'), max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(_('Longitude'), max_digits=10, decimal_places=7, null=True, blank=True)
    address = models.CharField(_('Address'), max_length=500, blank=True, help_text=_('For Google Maps autocomplete'))
    show_on_map = models.BooleanField(_('Show on homepage map'), default=False)
    
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
    
    # === Helper methods for display ===
    
    def get_price_display(self):
        """Returns formatted price range: $155,000 – $220,000"""
        if self.price_min and self.price_max and self.price_min != self.price_max:
            return f"${int(self.price_min):,} – ${int(self.price_max):,}"
        elif self.price_min:
            return f"${int(self.price_min):,}"
        elif self.price_max:
            return f"${int(self.price_max):,}"
        return ''
    
    def get_price_per_sqm_display(self):
        """Returns formatted price per sqm range"""
        if self.price_per_sqm_min and self.price_per_sqm_max and self.price_per_sqm_min != self.price_per_sqm_max:
            return f"${int(self.price_per_sqm_min):,} – ${int(self.price_per_sqm_max):,}"
        elif self.price_per_sqm_min:
            return f"${int(self.price_per_sqm_min):,}"
        elif self.price_per_sqm_max:
            return f"${int(self.price_per_sqm_max):,}"
        return ''
    
    def get_bedrooms_display(self):
        """Returns formatted bedrooms range: Studio – 2"""
        def format_bed(val):
            return 'Studio' if val == 0 else str(val)
        
        if self.bedrooms_min is not None and self.bedrooms_max is not None:
            if self.bedrooms_min != self.bedrooms_max:
                return f"{format_bed(self.bedrooms_min)} – {format_bed(self.bedrooms_max)}"
            return format_bed(self.bedrooms_min)
        elif self.bedrooms_min is not None:
            return format_bed(self.bedrooms_min)
        elif self.bedrooms_max is not None:
            return format_bed(self.bedrooms_max)
        return ''
    
    def get_total_area_display(self):
        """Returns formatted area range: 36.4–60 m²"""
        if self.total_area_min and self.total_area_max and self.total_area_min != self.total_area_max:
            return f"{self.total_area_min}–{self.total_area_max} m²"
        elif self.total_area_min:
            return f"{self.total_area_min} m²"
        elif self.total_area_max:
            return f"{self.total_area_max} m²"
        return ''
    
    def get_living_area_display(self):
        """Returns formatted living area range"""
        if self.living_area_min and self.living_area_max and self.living_area_min != self.living_area_max:
            return f"{self.living_area_min}–{self.living_area_max} m²"
        elif self.living_area_min:
            return f"{self.living_area_min} m²"
        elif self.living_area_max:
            return f"{self.living_area_max} m²"
        return ''
    
    def get_plot_area_display(self):
        """Returns formatted plot area range"""
        if self.plot_area_min and self.plot_area_max and self.plot_area_min != self.plot_area_max:
            return f"{self.plot_area_min}–{self.plot_area_max} m²"
        elif self.plot_area_min:
            return f"{self.plot_area_min} m²"
        elif self.plot_area_max:
            return f"{self.plot_area_max} m²"
        return ''
    
    def get_roi_display(self):
        """Returns formatted ROI range: 10–12%"""
        if self.roi_min and self.roi_max and self.roi_min != self.roi_max:
            return f"{self.roi_min}–{self.roi_max}%"
        elif self.roi_min:
            return f"{self.roi_min}%"
        elif self.roi_max:
            return f"{self.roi_max}%"
        return ''
    
    def get_price_range(self):
        """For filter matching - uses price_min"""
        price = self.price_min
        if not price:
            return None
        p = int(price)
        if p < 100000: return 'up_to_100k'
        if p < 150000: return '100k_150k'
        if p < 200000: return '150k_200k'
        if p < 300000: return '200k_300k'
        if p < 500000: return '300k_500k'
        if p < 700000: return '500k_700k'
        if p < 1000000: return '700k_1m'
        return 'over_1m'