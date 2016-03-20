from dashboard.settings.base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases


INSTALLED_APPS = INSTALLED_APPS + (
    'django_extensions',
    'debug_toolbar',
)

# Use mailtrap for testing emails
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_HOST = 'mailtrap.io'
EMAIL_HOST_USER = '03aa4dde824146'
EMAIL_HOST_PASSWORD = '6a65f000111102'
EMAIL_PORT = '2525'
EMAIL_USE_TLS = True

