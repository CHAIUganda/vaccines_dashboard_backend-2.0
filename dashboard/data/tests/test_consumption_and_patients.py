from collections import defaultdict

from django.test import TestCase

from dashboard.data.consumption_patients import ConsumptionAndPatientsQualityCheck
from dashboard.data.tests.test_data import FakeReport
from dashboard.helpers import *


class ConsumptionAndPatientsQualityCheckTestCase(TestCase):
    def test_report_can_search_for_record_by_subset(self):
        report = FakeReport()
        check = ConsumptionAndPatientsQualityCheck(report)
        collection = defaultdict(list)
        collection["The place"] = [
            {
                "formulation": "F1"
            }
        ]
        facility_name = "The place"
        records = check.get_records_from_collection(collection, facility_name)
        self.assertEqual(records, [{'formulation': 'F1'}])

    def test_get_patient_records(self):
        report = FakeReport()
        report.locs = [{'name': "place_1"}]
        report.ads = {
            'place_1': [
                {FORMULATION: 'A', NEW: 1},
                {FORMULATION: 'B', NEW: 2},
                {FORMULATION: 'C', NEW: 3}
            ]
        }
        check = ConsumptionAndPatientsQualityCheck(report)
        records = check.get_patient_records("place_1", ["A", "B"], True)
        self.assertEqual(records, [{'formulation': 'A', 'new': 1}, {'formulation': 'B', 'new': 2}])
