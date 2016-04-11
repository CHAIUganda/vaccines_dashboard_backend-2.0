from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt

import dashboard.views.api
import dashboard.views.main
import dashboard.views.tables

urlpatterns = [
    url(r'^$', dashboard.views.main.HomeView.as_view(), name='home'),
    url(r'^about/$', dashboard.views.main.AboutPageView.as_view(), name='about'),
    url(r'^about/tests$', dashboard.views.main.AboutTestPageView.as_view(), name='about.tests'),
    url(r'^about/background$', dashboard.views.main.AboutBackground.as_view(), name='about.background'),
    url(r'^about/how_works$', dashboard.views.main.AboutHowWorks.as_view(), name='about.how_works'),
    url(r'^about/how_used$', dashboard.views.main.AboutHowUsed.as_view(), name='about.how_used'),
    url(r'^import/$', dashboard.views.main.DataImportView.as_view(), name='import'),
    url(r'^reports/$', dashboard.views.main.ReportsView.as_view(), name='reports'),
    url(r'^api/test/submittedOrder', dashboard.views.api.FacilitiesReportingView.as_view(), name='submiited_order'),
    url(r'^api/test/orderType', dashboard.views.api.WebBasedReportingView.as_view(), name='order_type'),
    url(r'^api/test/facilitiesMultiple', dashboard.views.api.FacilitiesMultipleReportingView.as_view(), name='facilities_multiple'),
    url(r'^api/test/orderFormFreeOfGaps', dashboard.views.api.OrderFormFreeOfGapsView.as_view(), name='order_form_free_of_gaps'),
    url(r'^api/test/closingBalance', dashboard.views.api.ClosingBalanceView.as_view(), name='closing_balance_matches_opening_balance'),
    url(r'^api/test/orderFormFreeOfNegativeNumbers', dashboard.views.api.OrderFormFreeOfNegativeNumbersView.as_view(), name='order_form_free_of_negative_numbers'),
    url(r'^api/test/differentOrdersOverTime', dashboard.views.api.DifferentOrdersOverTimeView.as_view(), name='different_orders_over_time'),
    url(r'^api/test/consumptionAndPatients', dashboard.views.api.ConsumptionAndPatientsView.as_view(), name='consumption_and_patients'),
    url(r'^api/test/stableConsumption', dashboard.views.api.StableConsumptionView.as_view(), name='stable_consumption'),
    url(r'^api/test/stablePatientVolumes', dashboard.views.api.StablePatientVolumesView.as_view(), name='stable_patient_volumes'),
    url(r'^api/test/warehouseFulfilment', dashboard.views.api.WarehouseFulfilmentView.as_view(), name='warehouse_fulfilment'),
    url(r'^api/test/guidelineAdherence', dashboard.views.api.GuideLineAdherenceView.as_view(), name='guideline_adherence'),
    url(r'^api/test/nnrtiCurrentAdults', dashboard.views.api.NNRTICurrentAdultsView.as_view(), name='nnrti_current_adults'),
    url(r'^api/test/nnrtiCurrentPaed', dashboard.views.api.NNRTICurrentPaedView.as_view(), name='nnrti_current_paed'),
    url(r'^api/test/nnrtiNewAdults', dashboard.views.api.NNRTINewAdultsView.as_view(), name='nnrti_new_adults'),
    url(r'^api/test/nnrtiNewPaed', dashboard.views.api.NNRTINewPaedView.as_view(), name='nnrti_new_paed'),
    url(r'^api/test/ranking/best$', dashboard.views.api.BestPerformingDistrictsView.as_view(), name='ranking_best'),
    url(r'^api/test/ranking/worst$', dashboard.views.api.WorstPerformingDistrictsView.as_view(), name='ranking_worst'),
    url(r'^api/test/ranking/best/csv$', dashboard.views.api.BestPerformingDistrictsCSVView.as_view(), name='ranking_best_csv'),
    url(r'^api/test/ranking/worst/csv$', dashboard.views.api.WorstPerformingDistrictsCSVView.as_view(), name='ranking_worst_csv'),
    url(r'^api/cycles$', dashboard.views.api.CyclesView.as_view(), name='cycles'),
    url(r'^api/test/metrics', dashboard.views.api.ReportMetrics.as_view(), name='metrics'),
    url(r'^api/scores', dashboard.views.api.FacilityTestCycleScoresListView.as_view(), name='scores'),
    url(r'^api/filters', dashboard.views.api.FilterValuesView.as_view(), name='filters'),
    url(r'^api/rankingsAccess', dashboard.views.api.RankingsAccessView.as_view(), name='rankings-access'),
    url(r'^api/table/scores$', csrf_exempt(dashboard.views.tables.ScoresTableView.as_view()), name='scores-table'),
    url(r'^api/table/scores/detail/(?P<id>\d+)/(?P<column>\d+)', csrf_exempt(dashboard.views.tables.ScoreDetailsView.as_view()), name='scores-detail'),
    url(r'^api/access/areas$', csrf_exempt(dashboard.views.api.AccessAreasView.as_view()), name='access-areas'),
]
