from django.conf.urls import url, include

from . import views
import coverage.views.api

urlpatterns = [

    url(r'^api/vaccinedoses', coverage.views.api.VaccineDoses.as_view(), name='vaccinedoses'),
    url(r'^api/annualizedcoverage', coverage.views.api.AnnualizedCoverage.as_view(), name='annualizedcoverage'),
    url(r'^api/dhis2vaccinedoses', coverage.views.api.DHIS2VaccineDoses.as_view(), name='dhis2vaccinedoses'),
]