from django.conf.urls import url, include

import performance_management.views.api


urlpatterns = [
    url(r'^api/activitybyorganizationstats', performance_management.views.api.ActivityByOrganization.as_view(), name='activitybyorganizationstats')
]