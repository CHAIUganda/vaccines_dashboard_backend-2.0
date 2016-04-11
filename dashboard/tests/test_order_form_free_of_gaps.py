import json
from django.core.urlresolvers import reverse
from django_webtest import WebTest
from mock import MagicMock, patch
from dashboard.helpers import *
from dashboard.models import Score
from dashboard.views.api import OrderFormFreeOfNegativeNumbersView, DifferentOrdersOverTimeView, ClosingBalanceView, \
    ConsumptionAndPatientsView, StableConsumptionView, WarehouseFulfilmentView, StablePatientVolumesView, \
    GuideLineAdherenceView, OrderFormFreeOfGapsView


class RegimenCheckViewCaseMixin():
    def get_url(self, end, start, url):
        return "%s?start=%s&&end=%s" % (url, start, end)


class OrderFormFreeOfNegativesViewTestCase(WebTest, RegimenCheckViewCaseMixin):
    url_name = 'order_form_free_of_negative_numbers'
    test = ORDER_FORM_FREE_OF_NEGATIVE_NUMBERS
    view = OrderFormFreeOfNegativeNumbersView
    formulation = F1

    def test_view_is_wired_up(self):
        self.assertEqual(self.test, self.view.test)

    def get_url(self, end, start, url):
        regimen = F1
        return "%s?start=%s&&end=%s&&regimen=%s" % (url, start, end, regimen)

    @patch("dashboard.views.api.now")
    def test_filter_is_setup(self, time_mock):
        time_mock.return_value = arrow.Arrow(2015, 12, 1)
        year = "2015"
        url = reverse(self.url_name)
        start = "Mar - Apr %s" % year
        end = "Nov - Dec %s" % year
        Score.objects.create(**{self.test: {self.formulation: YES}, 'name': "F4", 'cycle': start})
        Score.objects.create(**{self.test: {self.formulation: NO}, 'name': "F5", 'cycle': start})
        Score.objects.create(**{self.test: {self.formulation: NO}, 'name': "F6", 'cycle': start})
        Score.objects.create(**{self.test: {self.formulation: NOT_REPORTING}, 'name': "F7", 'cycle': start})
        Score.objects.create(**{self.test: {self.formulation: NOT_REPORTING}, 'name': "F8", 'cycle': start})
        response = self.app.get(self.get_url(end, start, url), user="testuser")
        self.assertEqual(200, response.status_code)
        json_content = response.content.decode('utf8')
        data = json.loads(json_content)
        self.assertEqual(data['values'][0], {u'cycle': u'Mar - Apr 2015', u'no': 40, u'not_reporting': 40, u'yes': 20})

class OrderFormFreeOfGapsViewTestCase(OrderFormFreeOfNegativesViewTestCase):
    url_name = 'order_form_free_of_gaps'
    test = ORDER_FORM_FREE_OF_GAPS
    view = OrderFormFreeOfGapsView
    formulation = DEFAULT

    def test_url_setup(self):
        url = reverse(self.url_name)
        response = self.app.get(url, user="testuser")
        self.assertEqual(200, response.status_code)


class DifferentOrdersOverTimeViewTestCase(OrderFormFreeOfNegativesViewTestCase):
    url_name = 'different_orders_over_time'
    test = DIFFERENT_ORDERS_OVER_TIME
    view = DifferentOrdersOverTimeView


class ClosingBalanceViewTestCase(OrderFormFreeOfNegativesViewTestCase):
    url_name = 'closing_balance_matches_opening_balance'
    test = CLOSING_BALANCE_MATCHES_OPENING_BALANCE
    view = ClosingBalanceView


class ConsumptionAndPatientsViewTestCase(OrderFormFreeOfNegativesViewTestCase):
    url_name = 'consumption_and_patients'
    test = CONSUMPTION_AND_PATIENTS
    view = ConsumptionAndPatientsView


class StableConsumptionViewTestCase(OrderFormFreeOfNegativesViewTestCase):
    url_name = 'stable_consumption'
    test = STABLE_CONSUMPTION
    view = StableConsumptionView


class WarehouseFulfilmentViewTestCase(OrderFormFreeOfNegativesViewTestCase):
    url_name = 'warehouse_fulfilment'
    test = WAREHOUSE_FULFILMENT
    view = WarehouseFulfilmentView


class StablePatientVolumesViewTestCase(OrderFormFreeOfNegativesViewTestCase):
    url_name = 'stable_patient_volumes'
    test = STABLE_PATIENT_VOLUMES
    view = StablePatientVolumesView


class GuideLineAdherenceViewTestCase(OrderFormFreeOfNegativesViewTestCase):
    url_name = 'guideline_adherence'
    test = GUIDELINE_ADHERENCE_PAED_1L
    view = GuideLineAdherenceView
    formulation = DEFAULT

    def get_url(self, end, start, url):
        regimen = "Paed 1L"
        return "%s?start=%s&end=%s&regimen=%s" % (url, start, end, regimen)

    def test_view_is_wired_up(self):
        pass
