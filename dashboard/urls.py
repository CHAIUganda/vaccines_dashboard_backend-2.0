from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt

import dashboard.views.api
import dashboard.views.main
import dashboard.views.tables

urlpatterns = [
    url(r'^$', dashboard.views.main.HomeView.as_view(), name='home'),
    url(r'^about/$', dashboard.views.main.AboutPageView.as_view(), name='about'),
    url(r'^about/tests$', dashboard.views.main.AboutTestPageView.as_view(), name='about.tests'),
    url(r'^about/background$', dashboard.views.main.AboutBackground.as_view(), name='about.background'),
    url(r'^about/how_works$', dashboard.views.main.AboutHowWorks.as_view(), name='about.how_works'),
    url(r'^about/how_used$', dashboard.views.main.AboutHowUsed.as_view(), name='about.how_used'),
    url(r'^import/$', dashboard.views.main.DataImportView.as_view(), name='import'),
    url(r'^api/table/scores$', csrf_exempt(dashboard.views.tables.ScoresTableView.as_view()), name='scores-table'),
    url(r'^api/access/areas$', csrf_exempt(dashboard.views.api.AccessAreasView.as_view()), name='access-areas'),
]
