import dj_database_url
from cmp2.settings.base import *

ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': dj_database_url.config(default='mysql://root:ha9zqx@mysql:3306/nms_cmp')
}

# Use raven and sentry for error handling
RAVEN_CONFIG = {
    'dsn': 'https://4c8e07a6b1d74a89b47ee1e793d81234:eafcedbd79394d0fbed534d643fb4b77@app.getsentry.com/29151',
}

INSTALLED_APPS = INSTALLED_APPS + (
    'raven.contrib.django.raven_compat',
)

MEDIA_ROOT = '/home/docker/persistent/media/'

STATIC_ROOT = "/home/docker/volatile/static/"

# Use mailtrap for testing emails
EMAIL_HOST = 'mailtrap.io'
EMAIL_HOST_USER = '2283759d42c008ed2'
EMAIL_HOST_PASSWORD = 'e51ec9cc4f1329'
EMAIL_PORT = '2525'
EMAIL_USE_TLS = True

BROKER_HOST = "redis"
BROKER_BACKEND = "redis"
REDIS_PORT = 6379
REDIS_HOST = "redis"
BROKER_USER = ""
BROKER_PASSWORD = ""
BROKER_VHOST = "0"
REDIS_DB = 0

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'root': {
        'level': 'WARNING',
        'handlers': ['sentry', 'file'],
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
    },
    'handlers': {
        'sentry': {
            'level': 'ERROR',
            'class': 'raven.contrib.django.raven_compat.handlers.SentryHandler',
        },
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/tmp/django-errors.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'raven': {
            'level': 'ERROR',
            'handlers': ['file'],
            'propagate': False,
        },
        'sentry.errors': {
            'level': 'ERROR',
            'handlers': ['file'],
            'propagate': False,
        },
    },
}