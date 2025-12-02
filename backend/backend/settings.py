# backend/oneagency/settings.py
import os
import sys
from pathlib import Path
from django.utils.translation import gettext_lazy as _
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "1ins#Zvdsecure1-1default1asdsdasdasd1$5%!#")

DEBUG = True

# ALLOWED_HOSTS
if DEBUG:
    ALLOWED_HOSTS = ["*"]
else:
    ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost 127.0.0.1").split()

CSRF_TRUSTED_ORIGINS = [
    "https://*.oneagency.group",
    "https://oneagency.group",
    "http://localhost",
    "http://localhost:8000",
    "http://backend-1:8000",
    "http://127.0.0.1",
    "http://127.0.0.1:8000",
    "http://0.0.0.0:8000",
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    
    # Third party - порядок важен!
    'easy_thumbnails',
    'filer',
    'mptt',
    'parler',
    'tinymce',
    'taggit',
    'meta',

    # Dev
    'django_browser_reload',
    
    # Local apps
    'core',
    'properties',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django_browser_reload.middleware.BrowserReloadMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.i18n',
                'core.context_processors.site_settings',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'oneagency'),
        'USER': os.environ.get('DB_USER', 'oneagency_user'),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", ""),
        "HOST": os.getenv("DB_HOST", ""),
        "PORT": int(os.getenv("DB_PORT", 5432)),
    }
}

if 'runserver' in sys.argv:
    DATABASES['default']['HOST'] = 'localhost'

# Cache (Redis)
if os.environ.get('REDIS_URL'):
    CACHES = {
        'default': {
            'BACKEND': 'django_redis.cache.RedisCache',
            'LOCATION': os.environ.get('REDIS_URL', 'redis://127.0.0.1:6379/1'),
            'OPTIONS': {
                'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            }
        }
    }
else:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Продолжение backend/oneagency/settings.py

# Internationalization
LANGUAGE_CODE = 'en'
TIME_ZONE = 'Asia/Makassar'
USE_I18N = True
USE_L10N = True
USE_TZ = True

LANGUAGES = [
    ('en', _('English')),
    ('ru', _('Russian')),
]

PARLER_ENABLE_CACHING = True

if 'runserver' in sys.argv:
    PARLER_ENABLE_CACHING = False

# Django-parler
PARLER_LANGUAGES = {
    None: (
        {'code': 'en'},
        {'code': 'ru'},
    ),
    'default': {
        'fallbacks': ['en'],
        'hide_untranslated': False,
    }
}

LOCALE_PATHS = [
    BASE_DIR / 'locale',
]

# Static files
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Продолжение backend/oneagency/settings.py

# TinyMCE
# TinyMCE
TINYMCE_DEFAULT_CONFIG = {
    "height": 800,
    "width": "auto",
    "menubar": "file edit view insert format tools table",
    "plugins": """
        accordion advlist autolink lists link image charmap preview anchor searchreplace 
        visualblocks code fullscreen insertdatetime media table 
        help wordcount emoticons codesample nonbreaking pagebreak
    """,
    "toolbar": """
        undo redo | styles | bold italic | accordion underline strikethrough | 
        forecolor backcolor | alignleft aligncenter alignright alignjustify |
        bullist numlist | outdent indent | link image media | 
        table | removeformat code fullscreen help
    """,
    "license_key": "gpl",
    "style_formats": [
        {"title": "Paragraph", "format": "p", "classes": "mt-20"},
        {"title": "Heading 1", "format": "h1"},
        {"title": "Heading 2", "format": "h2", "classes": "text-30 md:text-24"},
        {"title": "Heading 3", "format": "h3"},
        {"title": "Heading 4", "format": "h4"},
        {"title": "Heading 5", "format": "h5"},
        {"title": "Heading 6", "format": "h6"},
        {
            "title": "CTA Button",
            "selector": "a",
            "classes": "cta-button button -md -dark-1 bg-accent-1 text-white",
        },
        {
            "title": "CTA Outline",
            "selector": "a",
            "classes": "cta-button-outline button -outline-accent-1 text-accent-1",
        },
    ],
    "color_map": [
        "000000", "Black",
        "4D4D4D", "Dark grey",
        "999999", "Grey",
        "E6E6E6", "Light grey",
        "FFFFFF", "White",
        "E64C4C", "Red",
        "E6804C", "Orange",
        "E6E64C", "Yellow",
        "99E64C", "Light green",
        "4CE64C", "Green",
        "4CE699", "Aquamarine",
        "4CE6E6", "Turquoise",
        "4C99E6", "Light blue",
        "4C4CE6", "Blue",
        "994CE6", "Purple",
        "E64CE6", "Magenta",
        "E64C99", "Pink",
    ],
    "image_advtab": True,
    "image_caption": True,
    "image_class_list": [
        {"title": "None", "value": ""},
        {"title": "Float Left", "value": "img-float-left"},
        {"title": "Float Right", "value": "img-float-right"},
        {"title": "Center", "value": "img-center"},
    ],
    "image_title": True,
    "image_toolbar": "alignleft aligncenter alignright | image",
    "automatic_uploads": True,
    "file_picker_types": "image",
    "images_upload_url": "/tinymce/upload/",
    "images_reuse_filename": False,
    "table_toolbar": "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
    "table_appearance_options": True,
    "table_grid": True,
    "table_resize_bars": True,
    "table_default_attributes": {"border": "1"},
    "table_default_styles": {"border-collapse": "collapse", "width": "100%"},
    "content_style": """
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #32373c;
            padding: 20px;
        }
    """,
    "extended_valid_elements": """
        div[class|style|data-*],
        span[class|style|data-*],
        i[class|style|data-*],
        br,
        img[class|src|alt|title|width|height|loading|data-*],
        a[href|target|rel|class|style|aria-label|aria-*|title],
        iframe[src|width|height|frameborder|allow|allowfullscreen|title|loading|referrerpolicy],
        figure[class|data-*],
        table[class|style|border|cellpadding|cellspacing],
        td[class|style|colspan|rowspan|data-label],
        th[class|style|colspan|rowspan|data-label],
        details[open|class|style|data-*|role|aria-*],
        summary[class|style|data-*|role|aria-*],
        ul[class|style|data-*],
        li[class|style|data-*],
        p[class|style|data-*|aria-*],
    """,
    "valid_elements": "+i[class|style|data-*],+span[class|style|data-*]",
    "valid_classes": {
        "div": (
            "table-responsive table-stack stack-item image-gallery gallery-grid gallery-item media accordion-panel "
            "accordion -simple row y-gap-20 mt-30 js-accordion "
            "col-12 accordion__item px-20 py-15 border-1 rounded-12 "
            "accordion__button d-flex items-center justify-between "
            "button text-16 text-dark-1 "
            "accordion__icon size-30 flex-center bg-light-2 rounded-full "
            "accordion__content pt-20 ck-content "
        ),
        "img": "gallery-image",
        "table": "compact striped lake-como-table table-normal",
        "span": (
            "stack-label stack-value stack-header "
            "icon-plus icon-minus text-13 "
            "text-accent-1 text-success text-warning "
            "badge tag"
        ),
        "i": ("icon-plus text-13 " "icon-minus text-13 "),
        "h2": "text-30 md:text-24",
        "p": "mt-20 mt-30 text-center",
        "ul": "list-disc mt-20",
        "ol": "numbered-list mt-20",
        "details": "accordion -simple row y-gap-20 mt-30 js-accordion",
        "summary": "button text-16 text-dark-1",
        "a": "cta-button cta-button-outline button -md -dark-1 bg-accent-1 text-white mt-30",
    },
    "valid_styles": {
        "*": "text-align,color,background-color,font-size,font-weight,text-decoration,margin,margin-left,margin-right,padding"
    },
    "branding": False,
    "promotion": False,
    "relative_urls": False,
    "remove_script_host": False,
    "convert_urls": True,
    "cleanup": False,
    "cleanup_on_startup": True,
    "paste_as_text": False,
    "paste_data_images": True,
    "browser_spellcheck": True,
    "contextmenu": False,
    "verify_html": False,
    "forced_root_block": "p",
    "force_br_newlines": False,
    "remove_trailing_brs": False,
    "remove_linebreaks": False,
    "convert_newlines_to_brs": False,
    "keep_styles": True,
    "entity_encoding": "raw",
    "allow_empty_tags": ["p", "br", "span", "div", "td", "th"],
    "pad_empty_with_br": True,
    "formats": {
        "alignleft": {
            "selector": "img",
            "styles": {"float": "left", "margin": "0 20px 10px 0"},
        },
        "alignright": {
            "selector": "img",
            "styles": {"float": "right", "margin": "0 0 10px 20px"},
        },
        "aligncenter": {
            "selector": "img",
            "styles": {
                "display": "block",
                "margin-left": "auto",
                "margin-right": "auto",
            },
        },
    },
}

# Django Filer
FILER_CANONICAL_URL = 'files/'
FILER_ALLOW_REGULAR_USERS_TO_ADD_ROOT_FOLDERS = True

THUMBNAIL_PROCESSORS = [
    'easy_thumbnails.processors.colorspace',
    'easy_thumbnails.processors.autocrop',
    'easy_thumbnails.processors.scale_and_crop',
    'easy_thumbnails.processors.filters',
]

THUMBNAIL_ALIASES = {
    '': {
        'service_thumb': {'size': (325, 400), 'crop': True},
        'partner_logo': {'size': (200, 100), 'crop': False},
        'concierge_thumb': {'size': (100, 100), 'crop': True},
        'hero_image': {'size': (440, 440), 'crop': True},
    },
}

# Taggit
TAGGIT_CASE_INSENSITIVE = True

# Django Meta (SEO)
META_SITE_PROTOCOL = 'https'
META_SITE_DOMAIN = os.environ.get('SITE_DOMAIN', 'oneagency.group')
META_USE_OG_PROPERTIES = True
META_USE_TWITTER_PROPERTIES = True


# Продолжение backend/oneagency/settings.py

# Email Configuration (Gmail SMTP)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')

ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@oneagency.group')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'One Agency <noreply@oneagency.group>')

# Security (для production)
if not DEBUG:
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.environ.get('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
    },
}