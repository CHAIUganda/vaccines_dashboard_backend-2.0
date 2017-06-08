from django.conf.urls import url, include

from . import views
import planning.views.api

urlpatterns = [
         url(r'^api/awpactivities', planning.views.api.AwpActivities.as_view(), name='AwpActivities'),
         url(r'^api/fundactivities', planning.views.api.FundActivities.as_view(), name='FundActivities'),
         url(r'^api/priorityactivities', planning.views.api.PriorityActivities.as_view(), name='PriorityActivities'),
         url(r'^api/activityyear', planning.views.api.ActivityYear.as_view(), name='ActivityYear'),


]