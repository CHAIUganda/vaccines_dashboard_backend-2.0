from django.conf.urls import url, include

import cold_chain.views.api


urlpatterns = [

    url(r'^api/districts', cold_chain.views.api.Districts.as_view(), name='district'),
    url(r'^api/carelevels', cold_chain.views.api.CareLevels.as_view(), name='carelevel'),
    url(r'^api/quarters', cold_chain.views.api.Quarters.as_view(), name='quarter'),
    url(r'^api/functionalitymetricsgraph', cold_chain.views.api.FunctionalityMetricsGraph.as_view(), name='functionalitymetricsgraph'),
    url(r'^api/functionalitymetrics', cold_chain.views.api.FunctionalityMetrics.as_view(), name='functionalitymetrics'),
    url(r'^api/capacitymetricsstats', cold_chain.views.api.CapacityMetricsStats.as_view(), name='capacitymetricsstats'),
    url(r'^api/capacitymetrics', cold_chain.views.api.CapacityMetrics.as_view(), name='capacitymetrics'),
    url(r'^api/eligiblefacilitiesstats', cold_chain.views.api.EligibleFacilityStats.as_view(), name='eligiblefacilitiesstats'),
    url(r'^api/eligiblefacilitiesmetrics', cold_chain.views.api.EligibleFacilityMetrics.as_view(), name='eligiblefacilitiesmetrics'),
    url(r'^api/optimalitymetrics', cold_chain.views.api.OptimalityMetric.as_view(), name='optimalitymetrics'),
    url(r'^api/optimalitystats', cold_chain.views.api.OptimalityStats.as_view(), name='optimalitystats'),
    url(r'^api/tempreportmetrics', cold_chain.views.api.TempReportMetrics.as_view(), name='tempreportmetrics')
]