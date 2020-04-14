from django.conf.urls import url, include

import performance_management.views.api


urlpatterns = [
    url(r'^api/activitybyorganizationstats', performance_management.views.api.ActivityByOrganization.as_view(), name='activitybyorganizationstats'),
    url(r'^api/activitystatuspercentages', performance_management.views.api.ActivityStatusPercentages.as_view(), name='activitystatuspercentages'),
    url(r'^api/activityfundingstats', performance_management.views.api.ActivityFundingStats.as_view(), name='activitystatuspercentages')
]