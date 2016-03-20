from .prod import *

DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.mysql',
    'NAME': 'test',
    'USER': os.environ.get('MYSQL_USER'),
    'PASSWORD': os.environ.get('MYSQL_PASSWORD'),
    'HOST': '127.0.0.1',
  }
}

BROKER_HOST = "localhost"
REDIS_HOST = "localhost"
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
