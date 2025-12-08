# backend/properties/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from parler.admin import TranslatableAdmin
from .models import Property, PropertyType, Location, Developer


@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Developer)
class DeveloperAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'website']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Property)
class PropertyAdmin(TranslatableAdmin):
    list_display = ['get_title', 'get_image_preview', 'developer', 'location', 
                    'property_type', 'get_price', 'status', 'is_active', 'is_featured', 'show_on_map']
    list_editable = ['is_active', 'is_featured', 'show_on_map']
    list_filter = ['status', 'is_active', 'is_featured', 'show_on_map', 'location', 'property_type', 'developer']
    search_fields = ['translations__title', 'developer__name']
    autocomplete_fields = ['developer', 'location', 'property_type']
    
    fieldsets = (
        (_('Basic'), {
            'fields': ('title', 'description', 'developer', 'property_type', 'location'),
        }),
        (_('Pricing'), {
            'fields': (
                ('price_min', 'price_max'),
                ('price_per_sqm_min', 'price_per_sqm_max'),
            ),
            'description': _('Enter price range. If single value, fill only "from" field.')
        }),
        (_('Size'), {
            'fields': (
                ('bedrooms_min', 'bedrooms_max'),
                ('total_area_min', 'total_area_max'),
                ('living_area_min', 'living_area_max'),
                ('plot_area_min', 'plot_area_max'),
            ),
            'description': _('Enter size ranges. 0 bedrooms = Studio.')
        }),
        (_('Status'), {
            'fields': ('status', 'completion_year', 'completion_quarter'),
        }),
        (_('Investment'), {
            'fields': (
                ('roi_min', 'roi_max'),
                'leasehold_years',
            ),
        }),
        (_('Features'), {
            'fields': ('view', 'facilities'),
            'description': _('View examples: Ocean / Sunset / Pool. Facilities: Pool, Sauna, Restaurant')
        }),
        (_('Media'), {
            'fields': ('image', 'video_url', 'presentation_ru', 'presentation_en'),
        }),
        (_('Map'), {
            'fields': ('address', ('latitude', 'longitude'), 'show_on_map'),
            'description': _('Start typing address - coordinates will be filled automatically')
        }),
        (_('Settings'), {
            'fields': ('is_active', 'is_featured', 'order'),
        }),
    )

    class Media:
        js = (
            'https://maps.googleapis.com/maps/api/js?key=AIzaSyDclz9k9pFeNkKZqxr-ifah6RxAv6pOx98&libraries=places',
            'admin/js/address_autocomplete.js',
        )

    def get_title(self, obj):
        return obj.safe_translation_getter('title', default='-')[:50]
    get_title.short_description = _('Title')

    def get_price(self, obj):
        return obj.get_price_display() or '-'
    get_price.short_description = _('Price')

    def get_image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="60" height="40" style="object-fit:cover;border-radius:4px;"/>', obj.image.url)
        return '-'
    get_image_preview.short_description = _('Image')