from django.conf.urls import url, include

from . import views
import coverage.views.api

urlpatterns = [

    url(r'^api/vaccinedoses', coverage.views.api.VaccineDoses.as_view(), name='vaccinedoses'),
    url(r'^api/coverageannualized', coverage.views.api.CoverageAnnualized.as_view(), name='CoverageAnnualized'),
    url(r'^api/dhis2vaccinedoses', coverage.views.api.DHIS2VaccineDoses.as_view(), name='dhis2vaccinedoses'),
]