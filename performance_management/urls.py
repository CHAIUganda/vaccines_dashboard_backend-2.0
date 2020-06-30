from django.conf.urls import url, include

import performance_management.views.api
import performance_management.views.main

urlpatterns = [
    url(r'^api/activitybyorganizationstats', performance_management.views.api.ActivityByOrganization.as_view(), name='activitybyorganizationstats'),
    url(r'^api/activitystatuspercentages', performance_management.views.api.ActivityStatusPercentages.as_view(), name='activitystatuspercentages'),
    url(r'^api/activityfundingstats', performance_management.views.api.ActivityFundingStats.as_view(), name='activitystatuspercentages'),
    url(r'^api/organizations', performance_management.views.api.OrganizationsList.as_view(), name='organizations'),
    url(r'^api/fundingsources', performance_management.views.api.FundingSourceOrganizationsList.as_view(), name='fundingorganizations'),
    url(r'^api/immunizationcomponents', performance_management.views.api.ImmunizationComponentList.as_view(), name='immunizationcomponents'),
    url(r'^api/activityperquarter', performance_management.views.api.PlannedActivitiesPerQuarterStats.as_view(), name='activityperquarter'),
    url(r'^api/budgetallocationperregion', performance_management.views.api.BudgetAllocationPerRegionStats.as_view(), name='budgetallocationperregion'),
    url(r'^api/iscfundingstats', performance_management.views.api.ISCFundingStats.as_view(), name='iscfundingstats'),
    # url(r'^api/activitystatusprogressstats', performance_management.views.api.ActivityStatusProgressStats.as_view(), name='activitystatusprogressstats'),
    url(r'^api/fundsourcemetrics', performance_management.views.api.FundSourceMetrics.as_view(), name='fundsourcemetrics'),
    url(r'^api/activities', performance_management.views.api.ActivityMetrics.as_view(), name='activitymetrics'),
    url(r'^api/budgetperquarter', performance_management.views.api.BudgetPerQuarterStats.as_view(), name='budgetperquarter'),
    url(r'^api/activitystatuses/(?P<pk>\d+)', performance_management.views.api.ActivityStatusRetrieveUpdate.as_view(), name='activitystatus'),
    url(r'^api/import$', performance_management.views.main.DataImportView.as_view(), name='import-performance'),

    url(r'^api/budgetallocationperimplementingagency',
        performance_management.views.api.BudgetAllocationPerImplementingAgency.as_view(), name='budgetallocationperimplementingagency'),
    url(r'^api/logentrys', performance_management.views.api.LogEntryView.as_view(), name='log-entry'),
]
