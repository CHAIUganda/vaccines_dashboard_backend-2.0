import dj_database_url
import raven as raven

from dashboard.settings.base import *

ALLOWED_HOSTS = ['*']

# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

DATABASES = {
     'default': {
         'ENGINE': 'django.db.backends.sqlite3',
         'NAME': os.path.join(BASE_DIR, 'dashboard.db3'),
     }
}


# DATABASES = {
#     'default': dj_database_url.config(default='mysql://root:ha9zqx@mysql:3306/vacdashboard')
# }

# Use raven and sentry for error handling
RAVEN_CONFIG = {
    'dsn': 'https://93299666ae92434181ed322ae1408307:ad3130e8222043a0b77cb552b7739643@app.getsentry.com/71194',
    # If you are using git, you can also automatically configure the
    # release based on the git info.
    #'release': raven.fetch_git_sha(os.path.dirname(__file__)),
}

INSTALLED_APPS += ['raven.contrib.django.raven_compat']

MEDIA_ROOT = '/home/docker/persistent/media/'

STATIC_ROOT = "/home/docker/volatile/static/"

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
        'level': 'INFO',
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
            'level': 'INFO',
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