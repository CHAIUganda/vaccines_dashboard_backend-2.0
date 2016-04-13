from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt

import dashboard.views.api
import dashboard.views.main
import dashboard.views.tables

urlpatterns = [

    url(r'^$', dashboard.views.main.HomeView.as_view(), name='home'),
    url(r'^stock$', dashboard.views.main.AboutBackground.as_view(), name='stock_management'),
    url(r'^fridge$', dashboard.views.main.AboutPageView.as_view(), name='fridge_coverage'),
    url(r'^surveillance$', dashboard.views.main.AboutTestPageView.as_view(), name='surveillance'),
    url(r'^import/$', dashboard.views.main.DataImportView.as_view(), name='import'),
]
