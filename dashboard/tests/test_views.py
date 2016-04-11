import json
import os
from json import loads

import arrow
from arrow import now
from django.core.urlresolvers import reverse
from django_webtest import WebTest
from mock import patch, ANY
from webtest import Upload

from dashboard.helpers import *
from dashboard.models import Cycle, Score, DashboardUser, MultipleOrderFacility


class HomeViewTestCase(WebTest):
    def test_correct_template(self):
        home = self.app.get('/', user="testuser")
        self.assertTemplateUsed(home, "home.html")

    def test_home_requires_login(self):
        home = self.app.get('/')
        self.assertEqual(302, home.status_code)


class DataImportViewTestCase(WebTest):
    def get_fixture_path(self, name):
        file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fixtures', name)
        return file_path

    @patch('dashboard.views.main.import_general_report.delay')
    def test_valid_form_starts_import_process(self, mock_method):
        user = DashboardUser.objects.create_superuser("a@a.com", "secret")
        cycle = 'Jan - Feb %s' % now().format("YYYY")
        url = '/import/'
        import_page = self.app.get(url, user=user)
        form = import_page.form
        form['cycle'] = cycle
        form['import_file'] = Upload(self.get_fixture_path("c.xlsx"))
        form.submit()
        mock_method.assert_called_with(ANY, cycle)


class FacilitiesReportingView(WebTest):
    def test_that_cycles_are_padded(self):
        cycle = 'Jan - Feb %s' % now().format("YYYY")
        Score.objects.create(REPORTING={DEFAULT: YES}, name="F2", cycle=cycle)
        Score.objects.create(REPORTING={DEFAULT: NO}, name="F3", cycle=cycle)
        url = "/api/test/submittedOrder"
        json_response = self.app.get(url, user="testuser").content.decode('utf8')
        data = loads(json_response)['values']
        self.assertIn({"reporting": 50, "cycle": cycle, "not_reporting": 50, "n_a": 0}, data)

    @patch("dashboard.views.api.now")
    def test_that_start_end_work(self, time_mock):
        time_mock.return_value = arrow.Arrow(2015, 12, 1)
        cycle = 'Jan - Feb 2015'
        cycle_2 = 'Mar - Apr 2015'
        Cycle.objects.create(title=cycle)
        url = "/api/test/submittedOrder?start=%s&end=%s" % (cycle, cycle_2)
        json_response = self.app.get(url, user="testuser").content.decode('utf8')
        data = loads(json_response)['values']
        self.assertEqual(len(data), 2)


class WebBasedReportingViewTestCase(WebTest):
    def test_that_cycles_are_padded(self):
        cycle = 'Jan - Feb %s' % now().format("YYYY")
        Score.objects.create(WEB_BASED={DEFAULT: WEB}, name="F2", cycle=cycle)
        Score.objects.create(WEB_BASED={DEFAULT: PAPER}, name="F3", cycle=cycle)
        url = "/api/test/orderType"
        json_response = self.app.get(url, user="testuser").content.decode('utf8')
        data = loads(json_response)['values']
        self.assertIn({"web": 50, "cycle": cycle, "paper": 50, "not_reporting": 0}, data)

    @patch("dashboard.views.api.now")
    def test_that_start_end_work(self, time_mock):
        time_mock.return_value = arrow.Arrow(2015, 12, 1)
        cycle = 'Jan - Feb 2015'
        cycle_2 = 'Mar - Apr 2015'
        Cycle.objects.create(title=cycle)
        url = "/api/test/orderType?start=%s&end=%s" % (cycle, cycle_2)
        json_response = self.app.get(url, user="testuser").content.decode('utf8')
        data = loads(json_response)['values']
        self.assertEqual(len(data), 2)


class FacilitiesMultipleReportingViewTestCase(WebTest):
    def test_shows_all_facilities_that_report_multiple_times(self):
        cycle = 'Jan - Feb %s' % now().format("YYYY")
        MultipleOrderFacility.objects.create(cycle=cycle, name="one")
        url = "/api/test/facilitiesMultiple"
        json_response = self.app.get(url, user="testuser").content.decode('utf8')
        data = loads(json_response)['values']
        self.assertEqual(len(data), 1)


class BestDistrictReportingViewFor(WebTest):
    def test_best_performing_districts(self):
        Score.objects.create(name="F1", warehouse="W1", ip="I1", district="D1", REPORTING={"DEFAULT": "YES"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=9, default_fail_count=4, f1_pass_count=1, f1_fail_count=9)
        Score.objects.create(name="F1", warehouse="W1", ip="I1", district="D2", REPORTING={"DEFAULT": "NO"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=6, default_fail_count=4, f1_pass_count=1, f1_fail_count=9)
        url = reverse("ranking_best")
        json_response = self.app.get(url, user="testuser").content.decode('utf8')
        data = loads(json_response)['values']
        self.assertEquals('D1', data[0]['name'])
        self.assertEquals(10.0, data[0]['rate'])

    def test_best_performing_ips(self):
        Score.objects.create(name="F1", warehouse="W1", ip="I1", district="D1", REPORTING={"DEFAULT": "YES"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=9, default_fail_count=4, f1_pass_count=1, f1_fail_count=9)
        Score.objects.create(name="F1", warehouse="W1", ip="I2", district="D2", REPORTING={"DEFAULT": "NO"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=6, default_fail_count=4, f1_pass_count=1, f1_fail_count=9)
        url = reverse("ranking_best") + "?level=ip"
        json_response = self.app.get(url, user="testuser").content.decode('utf8')
        data = loads(json_response)['values']
        self.assertEquals('I1', data[0]['name'])
        self.assertEquals(10.0, data[0]['rate'])

    def test_best_performing_warehouses(self):
        Score.objects.create(name="F1", warehouse="W1", ip="I1", district="D1", REPORTING={"DEFAULT": "YES"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=9, default_fail_count=4, f1_pass_count=1, f1_fail_count=9)
        Score.objects.create(name="F1", warehouse="W1", ip="I2", district="D2", REPORTING={"DEFAULT": "NO"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=6, default_fail_count=4, f1_pass_count=1, f1_fail_count=9)
        url = reverse("ranking_best") + "?level=warehouse"
        json_response = self.app.get(url, user="testuser").content.decode('utf8')
        data = loads(json_response)['values']
        self.assertEquals('W1', data[0]['name'])
        self.assertAlmostEqual(8.5, data[0]['rate'])

    def test_best_performing_facilities(self):
        Score.objects.create(name="F1", warehouse="W1", ip="I1", district="D1", REPORTING={"DEFAULT": "YES"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=9, default_fail_count=4, f1_pass_count=1, f1_fail_count=90)
        Score.objects.create(name="F2", warehouse="W1", ip="I2", district="D2", REPORTING={"DEFAULT": "NO"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=6, default_fail_count=4, f1_pass_count=1, f1_fail_count=9)
        url = reverse("ranking_best") + "?level=facility"
        json_response = self.app.get(url, user="testuser").content.decode('utf8')
        data = loads(json_response)['values']
        self.assertEquals('F1', data[0]['name'])
        self.assertEquals(10.0, data[0]['rate'])

    def test_worst_performing_districts(self):
        Score.objects.create(name="F1", warehouse="W1", ip="I1", district="D1", REPORTING={"DEFAULT": "YES"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=2, default_fail_count=3, f1_pass_count=4, f1_fail_count=5)
        Score.objects.create(name="F2", warehouse="W1", ip="I2", district="D2", REPORTING={"DEFAULT": "NO"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=6, default_fail_count=4, f1_pass_count=1, f1_fail_count=9)
        url = reverse("ranking_worst")
        json_response = self.app.get(url, user="testuser").content.decode('utf8')
        data = loads(json_response)['values']
        self.assertEquals('D2', data[0]['name'])
        self.assertEquals(13.0, data[0]['rate'])

    def test_worst_performing_ips(self):
        Score.objects.create(name="F1", warehouse="W1", ip="I1", district="D1", REPORTING={"DEFAULT": "YES"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=6, default_fail_count=4, f1_pass_count=1, f1_fail_count=9)
        Score.objects.create(name="F2", warehouse="W1", ip="I2", district="D2", REPORTING={"DEFAULT": "NO"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=6, default_fail_count=4, f1_pass_count=1, f1_fail_count=90)
        url = reverse("ranking_worst") + "?level=ip"
        json_response = self.app.get(url, user="testuser").content.decode('utf8')
        data = loads(json_response)['values']
        self.assertEquals('I2', data[0]['name'])
        self.assertEquals(94, data[0]['rate'])

    def test_worst_performing_warehouses(self):
        Score.objects.create(name="F1", warehouse="W1", ip="I1", district="D1", REPORTING={"DEFAULT": "YES"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=2, default_fail_count=3, f1_pass_count=4, f1_fail_count=5)
        Score.objects.create(name="F2", warehouse="W2", ip="I2", district="D2", REPORTING={"DEFAULT": "NO"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=4, default_fail_count=3, f1_pass_count=4, f1_fail_count=9)
        url = reverse("ranking_worst") + "?level=warehouse"
        json_response = self.app.get(url, user="testuser").content.decode('utf8')
        data = loads(json_response)['values']
        self.assertEquals('W2', data[0]['name'])
        self.assertEquals(12.0, data[0]['rate'])

    def test_worst_performing_facilities(self):
        Score.objects.create(name="F1", warehouse="W1", ip="I1", district="D1", REPORTING={"DEFAULT": "YES"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=6, default_fail_count=4, f1_pass_count=1, f1_fail_count=9)
        Score.objects.create(name="F2", warehouse="W2", ip="I2", district="D2", REPORTING={"DEFAULT": "NO"},
                             WEB_BASED={"DEFAULT": "YES"}, default_pass_count=6, default_fail_count=4, f1_pass_count=1, f1_fail_count=20)
        url = reverse("ranking_worst") + "?level=facility"
        json_response = self.app.get(url, user="testuser").content.decode('utf8')
        data = loads(json_response)['values']
        self.assertEquals('F2', data[0]['name'])
        self.assertEquals(24.0, data[0]['rate'])

    def test_worst_csv(self):
        Score.objects.create(name="F1", warehouse="W1", ip="I1", district="D1", REPORTING={"DEFAULT": "YES"},
                             WEB_BASED={"DEFAULT": "YES"})
        Score.objects.create(name="F2", warehouse="W2", ip="I2", district="D2", REPORTING={"DEFAULT": "NO"},
                             WEB_BASED={"DEFAULT": "YES"})
        url = reverse("ranking_worst_csv") + "?level=facility"
        csv = self.app.get(url, user="testuser").content.decode('utf8')
        expected = """facility,Average Number of Fails
F1,0.0
F2,0.0
"""
        self.assertEquals(csv.replace("\r", ""), expected)

    def test_best_csv(self):
        Score.objects.create(name="F1", warehouse="W1", ip="I1", district="D1", REPORTING={"DEFAULT": "YES"},
                             WEB_BASED={"DEFAULT": "YES"})
        Score.objects.create(name="F2", warehouse="W2", ip="I2", district="D2", REPORTING={"DEFAULT": "NO"},
                             WEB_BASED={"DEFAULT": "YES"}, default_fail_count=12)
        url = reverse("ranking_best_csv") + "?level=facility"
        csv = self.app.get(url, user="testuser").content.decode('utf8')
        expected = """facility,Average Number of Passes
F1,0.0
F2,0.0
"""
        self.assertEquals(csv.replace("\r", ""), expected)


class FacilityTestCycleScoresListViewTestCase(WebTest):
    def test_should_make_one_query(self):
        Score.objects.create(name='AIC Jinja Special Clinic', warehouse='warehouse', district='dis1', ip='ip',
                             REPORTING={"formulation1": "YES", "formulation2": "NO"})
        with self.assertNumQueries(2):
            response = self.app.get(reverse("scores"))
            json_text = response.content.decode('utf8')
            data = json.loads(json_text)
            self.assertEqual(len(data['results']), 1)
            self.assertEqual(data['results'][0]['name'], 'AIC Jinja Special Clinic')
            self.assertEqual(data['results'][0]['warehouse'], 'warehouse')
            self.assertEqual(data['results'][0]['district'], 'dis1')
            self.assertEqual(data['results'][0]['ip'], 'ip')
            self.assertEqual(data['results'][0]['REPORTING'], {'formulation1': 'YES', 'formulation2': 'NO'})


class ScoreDetailsViewTestCase(WebTest):
    url_name = "scores-detail"

    def test_can_route_url(self):
        score = Score.objects.create()
        url = reverse(self.url_name, kwargs={"id": score.id, "column": 5})
        response = self.app.get(url)
        self.assertEqual(200, response.status_code)

    def test_can_get_location_data(self):
        score = Score.objects.create(name="Name 1", ip="IP 1", district="District 1", warehouse="Warehouse 1")
        url = reverse(self.url_name, kwargs={"id": score.id, "column": 5})
        response = self.app.get(url)
        self.assertEqual(200, response.status_code)
        self.assertTemplateUsed(response, "check/base.html")
        response_data = response.context
        self.assertEqual("Warehouse 1", response_data["score"]["warehouse"])
        self.assertEqual("IP 1", response_data["score"]["ip"])
        self.assertEqual("District 1", response_data["score"]["district"])
        self.assertEqual("Name 1", response_data["score"]["name"])

    def test_can_get_score(self):
        score = Score.objects.create(name="Name 1", ip="IP 1", district="District 1", warehouse="Warehouse 1", MULTIPLE_ORDERS={DEFAULT: YES})
        url = reverse(self.url_name, kwargs={"id": score.id, "column": 10})
        response = self.app.get(url)
        self.assertEqual(200, response.status_code)
        response_data = response.context
        self.assertEqual(True, response_data["has_result"])
        self.assertEqual(TEST_NAMES[MULTIPLE_ORDERS], response_data["result"]["test"])
        self.assertEqual('Pass', response_data["result"]["result"])

    def test_has_no_result_if_column_is_less_than_4(self):
        score = Score.objects.create(name="Name 1", ip="IP 1", district="District 1", warehouse="Warehouse 1")
        url = reverse(self.url_name, kwargs={"id": score.id, "column": 3})
        response = self.app.get(url)
        self.assertEqual(200, response.status_code)
        response_data = response.context
        self.assertEqual(False, response_data["has_result"])
