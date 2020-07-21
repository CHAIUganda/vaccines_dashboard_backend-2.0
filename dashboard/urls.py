from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt

import dashboard.views.api
import dashboard.views.main
import dashboard.views.tables

urlpatterns = [

    url(r'^$', dashboard.views.main.HomeView.as_view(), name='home'),
    url(r'^import/$', dashboard.views.main.DataImportView.as_view(), name='import'),
    url(r'^import/generic/logs$', dashboard.views.main.ImportLogsView.as_view(), name='import_logs'),
    url(r'^import/generic/(?P<data_type>.*)$', dashboard.views.main.GenericDataImportView.as_view(), name='generic_import'),
    url(r'^finance/$', dashboard.views.main.FinanceModuleView.as_view(), name='finance'),
    url(r'^finance/update$', dashboard.views.api.FinanceUpdateApiView.as_view(), name='finance_update'),
    url(r'^finance/list', dashboard.views.api.FinanceListApiView.as_view(), name='finance_list'),
    url(r'^finance/years', dashboard.views.api.FinanceYearsApiView.as_view(), name='finance_years'),


    url(r'^api/vaccines', dashboard.views.api.Vaccines.as_view(), name='month'),
    url(r'^api/months', dashboard.views.api.Months.as_view(), name='month'),
    url(r'^api/districts', dashboard.views.api.Districts.as_view(), name='district'),
    url(r'^api/lastperiod', dashboard.views.api.LastPeriod.as_view(), name='lastperiod'),

    url(r'^api/coverage/total', dashboard.views.api.CoverageRateTotal.as_view(), name='coverage_rate_total'),
    url(r'^api/coverage/district', dashboard.views.api.CoverageRate.as_view(), name='coverage_rate'),


    url(r'^api/stock/athandbydistrict', dashboard.views.api.StockAtHandByDistrictApi.as_view(), name='stock_at_hand_by_district'),
    url(r'^api/stock/athandbymonth', dashboard.views.api.StockAtHandByMonthApi.as_view(), name='stock_at_hand_by_month'),

    url(r'^api/stock/stockmonthsleft', dashboard.views.api.StockMonthsLeftAPI.as_view(), name='stock_months_left'),

    url(r'^api/stock/stockbydistrictvaccine', dashboard.views.api.StockByDistrictVaccineApi.as_view(), name='stock_by_district_vaccine'),
    url(r'^api/users', dashboard.views.api.UserView.as_view(), name='users'),


]
