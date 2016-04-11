import json
from django.core.urlresolvers import reverse
from django_webtest import WebTest
from dashboard.models import IIP, DISTRICT, WAREHOUSE, Score


class AccessAreasViewTestCase(WebTest):
    def test_should_list_areas_based_on_level(self):
        cases = [
            {"level": IIP, "values": ['IP1', 'IP2', 'IP3'], "name": "ip"},
            {"level": DISTRICT, "values": ['DIS1', 'DIS2', 'DIS3'], "name": "district"},
            {"level": WAREHOUSE, "values": ['WARE1', 'WARE2', 'WARE3'], "name": "warehouse"},
        ]
        for case in cases:
            for v in case["values"]:
                level = case["level"].lower()
                score = Score(name=v)
                setattr(score, level, v)
                score.save()
            url = "%s?level=%s" % (reverse('access-areas'), case['name'])
            response = self.app.get(url)
            data = json.loads(response.content.decode('utf8'))
            self.assertEquals(data, case['values'])

