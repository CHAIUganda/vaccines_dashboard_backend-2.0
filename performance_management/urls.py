from django.conf.urls import url, include

import performance_management.views.api


urlpatterns = [
    url(r'^api/activitybyorganizationstats', performance_management.views.api.ActivityByOrganization.as_view(), name='activitybyorganizationstats'),
    url(r'^api/activitystatuspercentages', performance_management.views.api.ActivityStatusPercentages.as_view(), name='activitystatuspercentages'),
    url(r'^api/activityfundingstats', performance_management.views.api.ActivityFundingStats.as_view(), name='activitystatuspercentages'),
    url(r'^api/organizations', performance_management.views.api.OrganizationsList.as_view(), name='organizations'),
    url(r'^api/immunizationcomponents', performance_management.views.api.ImmunizationComponentList.as_view(), name='immunizationcomponents'),
    url(r'^api/activityperquarter', performance_management.views.api.PlannedActivitiesPerQuarterStats.as_view(), name='activityperquarter'),
    url(r'^api/budgetallocationperregion', performance_management.views.api.BudgetAllocationPerRegionStats.as_view(), name='budgetallocationperregion'),
    url(r'^api/iscfundingstats', performance_management.views.api.ISCFundingStats.as_view(), name='iscfundingstats'),
    url(r'^api/activitystatusprogressstats', performance_management.views.api.ActivityStatusProgressStats.as_view(), name='activitystatusprogressstats'),
    url(r'^api/fundsourcemetrics', performance_management.views.api.FundSourceMetrics.as_view(), name='fundsourcemetrics'),
    url(r'^api/activitymetrics', performance_management.views.api.ActivityMetrics.as_view(), name='activitymetrics'),
]