import json
from arrow import now
from django.core.urlresolvers import reverse
from django_webtest import WebTest
from model_mommy import mommy
from dashboard.models import DashboardUser, IIP, DISTRICT, WAREHOUSE, Score
from dashboard.helpers import DEFAULT, YES, NO


class RankingsAccessViewTestCase(WebTest):
    def test_should_not_show_ip_if_access_level_is_ip(self):
        url = reverse('rankings-access')
        cases = [
            {"level": IIP, "values": ['District', 'Warehouse', 'Facility']},
            {"level": DISTRICT, "values": ['IP', 'Warehouse', 'Facility']},
            {"level": WAREHOUSE, "values": ['District', 'IP', 'Facility']},
        ]
        for case in cases:
            user = mommy.make(DashboardUser, access_level=case['level'])
            response = self.app.get(url, user=user)
            data = json.loads(response.content.decode('utf8'))
            self.assertEquals(data['values'], case['values'])


class FilterValuesViewTestCase(WebTest):
    def test_filters(self):
        Score.objects.create(warehouse='warehouse1', ip='ip1', district='district1', name="fa", cycle="Ja")
        Score.objects.create(warehouse='warehouse2', ip='ip1', district='district1', name="fa", cycle="Ja")
        expected_warehouses = [{'warehouse': 'warehouse1'}, {'warehouse': 'warehouse2'}]
        expected_ips = [{'ip': 'ip1'}]
        expected_districts = [{'district': 'district1'}]
        expected_cycles = [{'cycle': 'Ja'}]
        url = reverse("filters")
        response = self.app.get(url)
        data = json.loads(response.content.decode('utf8'))
        self.assertEquals(data['cycles'], expected_cycles)
        self.assertEquals(data['districts'], expected_districts)
        self.assertEquals(data['warehouses'], expected_warehouses)
        self.assertEqual(data['ips'], expected_ips)


class CyclesViewTestCase(WebTest):
    def test_cycles(self):
        score = Score.objects.create(cycle="May - Jun 2015")
        url = reverse("cycles")
        response = self.app.get(url)
        data = json.loads(response.content.decode('utf8'))
        self.assertTrue(score.cycle in data['values'])

class ReportingRateAggregateViewTestCase(WebTest):
    def test_should_only_consider_faciilites_user_has_access_to(self):
        cycle = 'Jan - Feb %s' % now().format("YYYY")
        Score.objects.create(name="F1", ip="IP1", cycle=cycle, REPORTING={DEFAULT: YES})
        Score.objects.create(name="F2", ip="IP1", cycle=cycle, REPORTING={DEFAULT: NO})
        user = mommy.make(DashboardUser, access_level='IP', access_area='IP1')
        url = reverse('submiited_order')
        response = self.app.get(url, user=user)
        data = json.loads(response.content.decode('utf8'))['values']
        self.assertIn({"reporting": 50, "cycle": cycle, "not_reporting": 50, "n_a": 0}, data)
