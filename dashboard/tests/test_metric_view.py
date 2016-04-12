import json
from django_webtest import WebTest
from dashboard.models import Balance
from dashboard.helpers import *
from django.core.urlresolvers import reverse


class ReportMetricTestCase(WebTest):
    formulation = DEFAULT

    def test_that_the_latest_cycle_is_considered(self):
        start = "Jan - Feb 2015"
        Balance.objects.create(**{REPORTING: {self.formulation: YES}, 'name': "F4", 'cycle': start})
        Balance.objects.create(**{REPORTING: {self.formulation: NO}, 'name': "F5", 'cycle': start})
        Balance.objects.create(**{REPORTING: {self.formulation: NO}, 'name': "F6", 'cycle': start})
        Balance.objects.create(**{REPORTING: {self.formulation: NOT_REPORTING}, 'name': "F7", 'cycle': start})
        Balance.objects.create(**{REPORTING: {self.formulation: NOT_REPORTING}, 'name': "F8", 'cycle': start})
        url = reverse("metrics")
        response = self.app.get(url, user="testuser")
        data = json.loads(response.content.decode('utf8'))
        self.assertEquals(data['reporting'], '20.0')
