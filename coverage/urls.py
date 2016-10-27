from django.conf.urls import url, include

from . import views
import coverage.views.api

urlpatterns = [

    url(r'^api/vaccinedoses', coverage.views.api.VaccineDoses.as_view(), name='vaccinedoses'),
    url(r'^api/dropoutrate', coverage.views.api.DropOutRate.as_view(), name='dropoutrate'),
]