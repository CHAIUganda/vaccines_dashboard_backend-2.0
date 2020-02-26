from django.conf.urls import url, include

import cold_chain.views.api


urlpatterns = [

    url(r'^api/districts', cold_chain.views.api.Districts.as_view(), name='district'),
    url(r'^api/facilitytypes', cold_chain.views.api.FacilityTypes.as_view(), name='facilitytypes'),
    url(r'^api/carelevels', cold_chain.views.api.CareLevels.as_view(), name='carelevel'),
    url(r'^api/quarters', cold_chain.views.api.Quarters.as_view(), name='quarter'),
    url(r'^api/immunizingfacilities', cold_chain.views.api.ImmunizingFacilities.as_view(), name='immunizingfacilities'),
    url(r'^api/districtimmunizingfacilities', cold_chain.views.api.DistrictImmunizingFacilities.as_view(), name='districtimmunizingfacilities'),
    url(r'^api/capacities', cold_chain.views.api.Capacities.as_view(), name='capacities'),
    url(r'^api/refrigerators', cold_chain.views.api.Refrigerators.as_view(), name='Refrigerators'),
    url(r'^api/facilityrefrigerators', cold_chain.views.api.FacilityRefrigerators.as_view(), name='facilityrefrigerators'),
    url(r'^api/districtrefrigerators', cold_chain.views.api.DistrictRefrigerators.as_view(), name='districtrefrigerators'),
    url(r'^api/districtcapacities', cold_chain.views.api.DistrictCapacities.as_view(), name='districtcapacities'),
    url(r'^api/facilitycapacities', cold_chain.views.api.FacilityCapacities.as_view(), name='facilitycapacities'),
    url(r'^api/functionalitymetrics', cold_chain.views.api.FunctionalityMetrics.as_view(), name='functionalitymetrics'),
]