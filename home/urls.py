from django.conf.urls import url, patterns
from home.views import HomeView, ImportView

urlpatterns = [
    url('^$', ImportView, name='import_view'),
]

# urlpatterns = patterns('',
#                        url('^$', ImportView, name='import_view'),
#                        )