import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = 'utk*7$&c36mlg75vy-!p5px#-jn^!3-u$j@02s50_+w+i7rt%('

DEBUG = True

ALLOWED_HOSTS = []

INSTALLED_APPS = (
    # 'django_cassandra_engine',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'table',
    'django_crontab',
    'bootstrap3',
    'dashboard',
    'qdbauth',
    'password_reset',
    'raven.contrib.django.raven_compat',
    'admirarchy',
    'menu',
    'rest_framework',
    'django.contrib.sites',
    'custom_user',
    'cold_chain',
    'coverage',
    'planning',
    'performance_management',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'vaccines.middleware.corsMiddleware'
)

ROOT_URLCONF = 'vaccines.urls'

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
]
CORS_ORIGIN_REGEX_WHITELIST = [
    'http://localhost:3000',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'vaccines.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'vaccines_db',
        'USER': 'postgres',
        'PASSWORD': 'admin',
        'HOST': 'postgres',
        'PORT': '5432',
    }
}

LANGUAGE_CODE = 'en-us'
from django.utils.translation import ugettext_lazy as _l
LANGUAGES=(
    ('en', _l(u'English')),
    ('en-us', _l(u'English')),
)

TIME_ZONE = 'Africa/Kampala'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATIC_URL = '/static/'
LOGIN_URL = '/login'
LOGIN_REDIRECT_URL = '/'
LOGOUT_URL = '/logout'
STATIC_ROOT = 'asset_files'

EMAIL_HOST = os.environ.get('EMAIL_HOST', '')
EMAIL_PORT = os.environ.get('EMAIL_PORT', '')
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
RAVEN_CONFIG = {
    'dsn': os.environ.get('SENTRY_DSN', None)
}

BROKER_URL = 'redis://127.0.0.1:6379/0'
CELERY_RESULT_BACKEND = 'redis://127.0.0.1:6379/0'

AUTH_USER_MODEL = 'dashboard.DashboardUser'
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 100
}

DHIS2_USER = 'qppu2'
DHIS2_PASS = 'Dhis2019!'
DHIS2_ADDRESS = 'https://hmis2.health.go.ug'

DHIS2_NEW_USER = 'm&e.chai'
DHIS2_NEW_PASS = 'Chai@2020$$$'
DHIS2_NEW_ADDRESS = 'https://hmis.health.go.ug'

# Details of library and configuration
# https://github.com/kraiz/django-crontab
CRONTAB_LOCK_JOBS = True

CRONJOBS = [
    ('0   0 1 * *', 'django.core.management.call_command', ['dhis2_05_download_data_sets', '201512']),
    ('0   0 1 * *', 'django.core.management.call_command', ['dhis2_06_parse_data_sets', '201512', '--bulk']),
    ('0   0 1 * *', 'django.core.management.call_command', ['parse_vaccine_doses', '201605'])
]

GENERIC_DATA_IMPORT = {
    'planned_targets': {
        'name': 'Planned Targets',
        'params': ('Year',),
        'function': 'dashboard.management.commands.planned_targets.import_targets'
    },
    'coverage_targets': {
        'name': 'Coverage Targets',
        'params': ('Year',),
        'function': 'dashboard.management.commands.coverage_targets.import_coverage_target'
    },
    'min_max': {
        'name': 'Stock Requirements Data (min/max)',
        'params': ('Year',),
        'function': 'dashboard.management.commands.load_min_max.import_min_max'
    },
    'capacity': {
        'name': 'Cold Chain Capacity',
        'params': ('Quarter',),
        'function': 'cold_chain.management.commands.capacity.import_capacity'
    },
    'cold_chain_functionality': {
        'name': 'Cold Chain Refrigerator',
        'params': (),
        'function': 'cold_chain.management.commands.functionality.import_functionality'
    },
    'cold_chain_immunizing_facility': {
        'name': 'Cold Chain Immunizing ColdChainFacility',
        'params': ('Quarter',),
        'function': 'cold_chain.management.commands.immunizingfacility.import_immunizing_facilities'
    },
    'cold_chain_facility': {
        'name': 'Cold Chain ColdChainFacility',
        'params': ('year', 'year_half',),
        'function': 'cold_chain.management.commands.facility.import_facilities'
    },
    'cold_chain_facility_type': {
        'name': 'Cold Chain ColdChainFacility Types',
        'params': (),
        'function': 'cold_chain.management.commands.load_TBL_Facilities.import_tab_facilities'
    },
    'cold_chain_performance_management': {
        'name': 'Cold Chain Performance Management',
        'params': ('year', 'month',),
        'function': 'cold_chain.management.commands.performance_management.import_performance_management'
    }
}

# The directory where uploaded files are stored
GENERIC_IMPORT_DIR = "/tmp"


SITE_ID = 1

try:
    from local_settings import *
except ImportError:
    pass

if ('test' in sys.argv) or ('jenkins' in sys.argv):
    DATABASES = {
        'default':
            {'ENGINE': 'django.db.backends.sqlite3',
             'NAME': 'test_sqlite.db'}
    }
    MEDIA_ROOT = 'media/test'
    PASSWORD_HASHERS = ('django.contrib.auth.hashers.MD5PasswordHasher',
                        'django.contrib.auth.hashers.SHA1PasswordHasher',)
    MEDIA_URL = "/media/"
    STATIC_URL = "/static/"
