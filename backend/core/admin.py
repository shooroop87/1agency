# backend/core/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import CodeSnippet
from parler.admin import TranslatableAdmin
from .models import (
    SiteSettings, Service, Review, Partner, FAQ,
    InvestmentCard, ConciergeService, PopupSettings, 
    ContactRequest, SEOSettings
)


@admin.register(SiteSettings)
class SiteSettingsAdmin(TranslatableAdmin):
    list_display = ['get_site_name', 'phone', 'email']
    
    fieldsets = (
        (_('General'), {
            'fields': ('site_name', 'site_description'),
        }),
        (_('Logo'), {
            'fields': ('logo', 'logo_mark'),
        }),
        (_('Contacts'), {
            'fields': ('phone', 'email', 'whatsapp', 'address'),
        }),
        (_('Social'), {
            'fields': ('instagram_ru', 'instagram_en'),
        }),
    )

    def get_site_name(self, obj):
        return obj.safe_translation_getter('site_name', default='-')
    get_site_name.short_description = _('Site name')

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Service)
class ServiceAdmin(TranslatableAdmin):
    list_display = ['get_title', 'get_image_preview', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['translations__title']
    
    fieldsets = (
        (_('Content'), {
            'fields': ('title', 'items'),
        }),
        (_('Media'), {
            'fields': ('image',),
        }),
        (_('Settings'), {
            'fields': ('order', 'is_active'),
        }),
    )

    def get_title(self, obj):
        return obj.safe_translation_getter('title', default='-')
    get_title.short_description = _('Title')

    def get_image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit:cover;border-radius:5px;"/>', obj.image.url)
        return '-'
    get_image_preview.short_description = _('Image')

# Продолжение backend/core/admin.py

@admin.register(Review)
class ReviewAdmin(TranslatableAdmin):
    list_display = ['get_name', 'get_title_short', 'order', 'is_active', 'created_at']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active', 'created_at']
    search_fields = ['translations__name', 'translations__title']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (_('Content'), {
            'fields': ('name', 'title', 'short_text', 'full_text'),
        }),
        (_('Settings'), {
            'fields': ('order', 'is_active'),
        }),
    )

    def get_name(self, obj):
        return obj.safe_translation_getter('name', default='-')
    get_name.short_description = _('Name')

    def get_title_short(self, obj):
        title = obj.safe_translation_getter('title', default='-')
        return title[:50] + '...' if len(title) > 50 else title
    get_title_short.short_description = _('Title')


@admin.register(Partner)
class PartnerAdmin(TranslatableAdmin):
    list_display = ['get_name', 'get_logo_preview', 'link', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['translations__name']
    
    fieldsets = (
        (_('Content'), {
            'fields': ('name', 'description'),
        }),
        (_('Media & Link'), {
            'fields': ('logo', 'link'),
        }),
        (_('Settings'), {
            'fields': ('order', 'is_active'),
        }),
    )

    def get_name(self, obj):
        return obj.safe_translation_getter('name', default='-')
    get_name.short_description = _('Name')

    def get_logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" width="80" height="40" style="object-fit:contain;"/>', obj.logo.url)
        return '-'
    get_logo_preview.short_description = _('Logo')


@admin.register(FAQ)
class FAQAdmin(TranslatableAdmin):
    list_display = ['get_question_short', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active', 'tags']
    search_fields = ['translations__question', 'translations__answer']
    
    fieldsets = (
        (_('Content'), {
            'fields': ('question', 'answer'),
        }),
        (_('Tags'), {
            'fields': ('tags',),
        }),
        (_('Settings'), {
            'fields': ('order', 'is_active'),
        }),
    )

    def get_question_short(self, obj):
        q = obj.safe_translation_getter('question', default='-')
        return q[:80] + '...' if len(q) > 80 else q
    get_question_short.short_description = _('Question')

# Продолжение backend/core/admin.py

@admin.register(InvestmentCard)
class InvestmentCardAdmin(TranslatableAdmin):
    list_display = ['get_title', 'get_icon_preview', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['translations__title']
    
    fieldsets = (
        (_('Content'), {
            'fields': ('title', 'description'),
        }),
        (_('Icon'), {
            'fields': ('icon', 'icon_svg'),
            'description': _('Use either uploaded icon or SVG code'),
        }),
        (_('Settings'), {
            'fields': ('order', 'is_active'),
        }),
    )

    def get_title(self, obj):
        return obj.safe_translation_getter('title', default='-')
    get_title.short_description = _('Title')

    def get_icon_preview(self, obj):
        if obj.icon:
            return format_html('<img src="{}" width="30" height="30"/>', obj.icon.url)
        elif obj.icon_svg:
            return format_html('SVG ✓')
        return '-'
    get_icon_preview.short_description = _('Icon')


@admin.register(ConciergeService)
class ConciergeServiceAdmin(TranslatableAdmin):
    list_display = ['get_title', 'get_image_preview', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['translations__title']
    
    fieldsets = (
        (_('Content'), {
            'fields': ('title', 'description'),
        }),
        (_('Media'), {
            'fields': ('image',),
        }),
        (_('Settings'), {
            'fields': ('order', 'is_active'),
        }),
    )

    def get_title(self, obj):
        return obj.safe_translation_getter('title', default='-')
    get_title.short_description = _('Title')

    def get_image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit:cover;border-radius:5px;"/>', obj.image.url)
        return '-'
    get_image_preview.short_description = _('Image')


@admin.register(PopupSettings)
class PopupSettingsAdmin(TranslatableAdmin):
    list_display = ['popup_type', 'get_title', 'is_active']
    list_editable = ['is_active']
    list_filter = ['popup_type', 'is_active']
    
    fieldsets = (
        (_('Type'), {
            'fields': ('popup_type',),
        }),
        (_('Form Content'), {
            'fields': ('title', 'subtitle', 'button_text'),
        }),
        (_('Success Screen'), {
            'fields': ('success_title', 'success_message'),
        }),
        (_('Settings'), {
            'fields': ('is_active',),
        }),
    )

    def get_title(self, obj):
        return obj.safe_translation_getter('title', default='-')
    get_title.short_description = _('Title')

# Продолжение backend/core/admin.py

@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ['name', 'request_type', 'email', 'phone', 'is_processed', 'created_at']
    list_editable = ['is_processed']
    list_filter = ['request_type', 'is_processed', 'created_at']
    search_fields = ['name', 'email', 'phone', 'message']
    date_hierarchy = 'created_at'
    readonly_fields = ['request_type', 'name', 'email', 'phone', 'message', 'property_type', 'created_at', 'updated_at']
    
    fieldsets = (
        (_('Request Info'), {
            'fields': ('request_type', 'created_at', 'updated_at'),
        }),
        (_('Contact Details'), {
            'fields': ('name', 'email', 'phone'),
        }),
        (_('Message'), {
            'fields': ('message', 'property_type'),
        }),
        (_('Processing'), {
            'fields': ('is_processed', 'admin_notes'),
        }),
    )

    def has_add_permission(self, request):
        return False

    actions = ['mark_as_processed', 'mark_as_unprocessed']

    @admin.action(description=_('Mark selected as processed'))
    def mark_as_processed(self, request, queryset):
        queryset.update(is_processed=True)

    @admin.action(description=_('Mark selected as unprocessed'))
    def mark_as_unprocessed(self, request, queryset):
        queryset.update(is_processed=False)


@admin.register(SEOSettings)
class SEOSettingsAdmin(TranslatableAdmin):
    list_display = ['page', 'get_meta_title']
    list_filter = ['page']
    
    fieldsets = (
        (_('Page'), {
            'fields': ('page',),
        }),
        (_('Meta Tags'), {
            'fields': ('meta_title', 'meta_description', 'meta_keywords'),
        }),
        (_('Open Graph'), {
            'fields': ('og_title', 'og_description', 'og_image'),
        }),
    )

    def get_meta_title(self, obj):
        return obj.safe_translation_getter('meta_title', default='-')
    get_meta_title.short_description = _('Meta title')


@admin.register(CodeSnippet)
class CodeSnippetAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'load_type', 'priority', 'is_active']
    list_editable = ['is_active', 'priority']
    list_filter = ['location', 'is_active', 'load_type']
    search_fields = ['name', 'code']
    
    fieldsets = (
        (_('Snippet'), {
            'fields': ('name', 'code'),
        }),
        (_('Placement'), {
            'fields': ('location', 'load_type', 'priority'),
        }),
        (_('Visibility'), {
            'fields': ('is_active', 'show_on_all', 'pages'),
        }),
    )


# Admin site customization
admin.site.site_header = 'One Agency Admin'
admin.site.site_title = 'One Agency'
admin.site.index_title = 'Content Management'