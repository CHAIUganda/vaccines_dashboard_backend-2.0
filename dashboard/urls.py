from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt

import dashboard.views.api
import dashboard.views.main
import dashboard.views.tables

urlpatterns = [

    url(r'^$', dashboard.views.main.HomeView.as_view(), name='home'),
    url(r'^import/$', dashboard.views.main.DataImportView.as_view(), name='import'),


    url(r'^api/vaccines', dashboard.views.api.Vaccines.as_view(), name='month'),
    url(r'^api/months', dashboard.views.api.Months.as_view(), name='month'),
    url(r'^api/districts', dashboard.views.api.Districts.as_view(), name='district'),

    url(r'^api/coverage/total', dashboard.views.api.CoverageRateTotal.as_view(), name='coverage_rate_total'),
    url(r'^api/coverage/district', dashboard.views.api.CoverageRate.as_view(), name='coverage_rate'),

    url(r'^api/stockbymonth', dashboard.views.api.StockByMonthApi.as_view(), name='stock_by_month'),
    url(r'^api/stock', dashboard.views.api.StockApi.as_view(), name='stock_at_hand'),
    url(r'^api/amc', dashboard.views.api.AmcApi.as_view(), name='amc'),

]
