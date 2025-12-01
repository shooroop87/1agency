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
                    'property_type', 'price', 'status', 'is_active', 'is_featured']
    list_editable = ['is_active', 'is_featured']
    list_filter = ['status', 'is_active', 'is_featured', 'location', 'property_type', 'developer']
    search_fields = ['translations__title', 'developer__name']
    autocomplete_fields = ['developer', 'location', 'property_type']
    
    fieldsets = (
        (_('Basic'), {
            'fields': ('title', 'description', 'developer', 'property_type', 'location'),
        }),
        (_('Pricing'), {
            'fields': ('price', 'price_per_sqm'),
        }),
        (_('Size'), {
            'fields': ('bedrooms', 'total_area', 'living_area', 'plot_area'),
        }),
        (_('Status'), {
            'fields': ('status', 'completion_year', 'completion_quarter'),
        }),
        (_('Investment'), {
            'fields': ('roi', 'leasehold_years'),
        }),
        (_('Features'), {
            'fields': ('view', 'facilities'),
        }),
        (_('Media'), {
            'fields': ('image', 'video_url', 'presentation_ru', 'presentation_en'),
        }),
        (_('Settings'), {
            'fields': ('is_active', 'is_featured', 'order'),
        }),
    )

    def get_title(self, obj):
        return obj.safe_translation_getter('title', default='-')[:50]
    get_title.short_description = _('Title')

    def get_image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="60" height="40" style="object-fit:cover;border-radius:4px;"/>', obj.image.url)
        return '-'
    get_image_preview.short_description = _('Image')