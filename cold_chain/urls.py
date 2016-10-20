from django.conf.urls import url, include

from . import views

import cold_chain.views.api
import dashboard.views.main


urlpatterns = [
    url(r'^$', dashboard.views.main.FridgeView.as_view(), name='cold'),

    url(r'^api/districts', cold_chain.views.api.Districts.as_view(), name='district'),
    url(r'^api/carelevels', cold_chain.views.api.CareLevels.as_view(), name='carelevel'),
    url(r'^api/quarters', cold_chain.views.api.Quarters.as_view(), name='quarter'),
    url(r'^api/immunizingfacilities', cold_chain.views.api.ImmunizingFacilities.as_view(), name='immunizingfacilities'),

]