from django.db.models import Q
from django.shortcuts import render_to_response
from django.views.generic import View
from django_datatables_view.base_datatable_view import BaseDatatableView

from dashboard.helpers import *
from dashboard.models import Score
from dashboard.views.data_sources import NegativesCheckDataSource, ConsumptionAndPatientsDataSource, TwoCycleDataSource, ClosingBalanceMatchesOpeningBalanceDataSource, StableConsumptionDataSource, StablePatientVolumesDataSource, WarehouseFulfillmentDataSource, GuidelineAdherenceDataSource, NNRTIDataSource


class ScoresTableView(BaseDatatableView):
    model = Score
    columns = [
        NAME,
        DISTRICT.lower(),
        WAREHOUSE.lower(),
        IP.lower(),
        REPORTING,
        WEB_BASED,
        GUIDELINE_ADHERENCE_ADULT_1L,
        GUIDELINE_ADHERENCE_ADULT_2L,
        GUIDELINE_ADHERENCE_PAED_1L,
        ORDER_FORM_FREE_OF_GAPS,
        MULTIPLE_ORDERS,
        ORDER_FORM_FREE_OF_NEGATIVE_NUMBERS,
        CONSUMPTION_AND_PATIENTS,
        DIFFERENT_ORDERS_OVER_TIME,
        CLOSING_BALANCE_MATCHES_OPENING_BALANCE,
        STABLE_CONSUMPTION,
        STABLE_PATIENT_VOLUMES,
        WAREHOUSE_FULFILMENT,
        NNRTI_NEW_PAED,
        NNRTI_CURRENT_PAED,
        NNRTI_NEW_ADULTS,
        NNRTI_CURRENT_ADULTS,
    ]
    order_columns = columns

    def prepare_results(self, qs):
        data = []
        for item in qs:
            data.append([self.render_column(item, column) for column in self.get_columns()])
        return data

    def render_column(self, row, column):
        display_text = {YES: PASS, NO: FAIL, NOT_REPORTING: N_A, PAPER: PAPER.upper(), WEB: WEB.upper()}
        default_columns = [REPORTING,
                           WEB_BASED,
                           MULTIPLE_ORDERS,
                           ORDER_FORM_FREE_OF_GAPS,
                           GUIDELINE_ADHERENCE_ADULT_1L,
                           GUIDELINE_ADHERENCE_ADULT_2L,
                           GUIDELINE_ADHERENCE_PAED_1L,
                           NNRTI_NEW_PAED,
                           NNRTI_CURRENT_PAED,
                           NNRTI_NEW_ADULTS,
                           NNRTI_CURRENT_ADULTS, ]
        formulation_columns = [STABLE_PATIENT_VOLUMES,
                               CONSUMPTION_AND_PATIENTS,
                               WAREHOUSE_FULFILMENT,
                               DIFFERENT_ORDERS_OVER_TIME,
                               CLOSING_BALANCE_MATCHES_OPENING_BALANCE,
                               ORDER_FORM_FREE_OF_NEGATIVE_NUMBERS,
                               STABLE_CONSUMPTION]
        formulation = self.request.POST.get(FORMULATION, F1)
        if column in default_columns:
            value_for_column = getattr(row, column)
            if type(value_for_column) == dict and DEFAULT in value_for_column:
                actual_result = value_for_column[DEFAULT]
                return display_text[actual_result] if actual_result else actual_result
            else:
                return ""
        elif column in formulation_columns:
            result = getattr(row, column)
            if type(result) == dict and formulation in result:
                actual_result = result[formulation]
                return display_text[actual_result] if actual_result else actual_result
            else:
                return ""
        else:
            return super(ScoresTableView, self).render_column(row, column)

    def get_initial_queryset(self):
        qs = super(ScoresTableView, self).get_initial_queryset()
        cycle = self.request.POST.get(u'cycle', None)
        district_filter = self.request.POST.get(u'district', None)
        ip = self.request.POST.get(u'ip', None)
        warehouse = self.request.POST.get(u'warehouse', None)
        filters = {}
        if cycle:
            filters['cycle'] = cycle
        if district_filter:
            districts = district_filter.split(',')
            filters['district__in'] = districts
        if ip:
            filters['ip'] = ip
        if warehouse:
            filters['warehouse'] = warehouse

        if self.request.user:
            if self.request.user.access_level and self.request.user.access_area:
                filters[self.request.user.access_level.lower()] = self.request.user.access_area

        qs = qs.filter(**filters)
        return qs

    def filter_queryset(self, qs):
        search = self.request.POST.get(u'search[value]', None)
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(district__icontains=search) | Q(ip__icontains=search) | Q(warehouse__icontains=search))
        return qs

    def prepare_results(self, qs):
        data = []
        for item in qs:
            row = [self.render_column(item, column) for column in self.get_columns()]
            row.append(item.id)
            data.append(row)
        return data


class ScoreDetailsView(View):
    def get(self, request, id, column):
        TEST_DATA = {
            ORDER_FORM_FREE_OF_NEGATIVE_NUMBERS: NegativesCheckDataSource,
            CONSUMPTION_AND_PATIENTS: ConsumptionAndPatientsDataSource,
            DIFFERENT_ORDERS_OVER_TIME: TwoCycleDataSource,
            CLOSING_BALANCE_MATCHES_OPENING_BALANCE: ClosingBalanceMatchesOpeningBalanceDataSource,
            STABLE_CONSUMPTION: StableConsumptionDataSource,
            STABLE_PATIENT_VOLUMES: StablePatientVolumesDataSource,
            WAREHOUSE_FULFILMENT: WarehouseFulfillmentDataSource,
            GUIDELINE_ADHERENCE_PAED_1L: GuidelineAdherenceDataSource,
            GUIDELINE_ADHERENCE_ADULT_2L: GuidelineAdherenceDataSource,
            GUIDELINE_ADHERENCE_ADULT_1L: GuidelineAdherenceDataSource,
            NNRTI_NEW_PAED: NNRTIDataSource,
            NNRTI_NEW_ADULTS: NNRTIDataSource,
            NNRTI_CURRENT_ADULTS: NNRTIDataSource,
            NNRTI_CURRENT_PAED: NNRTIDataSource
        }
        scores = {YES: "Pass", NO: "Fail", NOT_REPORTING: "N/A", PAPER: PAPER, WEB: WEB}
        combination = request.GET.get('combination', DEFAULT)
        column = int(column)
        score = Score.objects.get(id=id)
        score_data = {'ip': score.ip, 'district': score.district, 'warehouse': score.warehouse, 'name': score.name, 'cycle': score.cycle, 'combination': combination}
        has_result = column > 3
        response_data = {'score': score_data, 'has_result': has_result}
        template_name = "check/base.html"
        if has_result:
            view = ScoresTableView()
            test = view.columns[column]
            if test in TEST_DATA:
                data_source_class = TEST_DATA.get(test)
                data_source = data_source_class()
                template_name = data_source.get_template(test)
                response_data['data'] = data_source.load(score, test, combination)
            result = getattr(score, test, None)

            def combination_yes():
                return result.get(combination) if type(result) == dict else result

            def combination_no():
                return result.get(DEFAULT, None) if type(result) == dict else result

            actual_result = combination_yes() if combination in result else combination_no()
            result_data = {'test': TEST_NAMES.get(test, None), 'result': scores.get(actual_result), 'has_combination': len(result) > 1}
            response_data['result'] = result_data
        return render_to_response(template_name, context=response_data)
