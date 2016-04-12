from collections import defaultdict

from django.test import TestCase
from mock import patch, call

from dashboard.data.tests.test_data import FakeReport
from dashboard.models import Balance, Consumption, AdultPatientsRecord, PAEDPatientsRecord, YearMonth, MultipleOrderFacility
from dashboard.tasks import persist_totals, persist_consumption, persist_adult_records, persist_paed_records, get_report_for_other_cycle, calculate_totals_in_month, persist_multiple_order_records


class TaskTestCase(TestCase):

    def test_should_record_scores_for_each_facility(self):
        report = FakeReport()
        report.cycle = "May - Jun 2015"
        report.locs = [{
            'name': 'location_one',
            'IP': 'ip_one',
            'District': 'district_one',
            'Warehouse': 'warehouse_one',
            'scores': {
                'WEB_BASED': {'DEFAULT': 'YES'},
                'REPORTING': {'DEFAULT': 'NO'},
            }
        },
            {
                'name': 'location_two',
                'District': 'district_one',
                'IP': 'ip_one',
                'Warehouse': 'warehouse_one',
                'scores': {
                    'WEB_BASED': {'DEFAULT': 'YES'},
                    'REPORTING': {'DEFAULT': 'NO'},
                }
            }]
        self.assertEqual(Balance.objects.count(), 0)
        persist_totals(report)
        persist_totals(report)
        self.assertEqual(Balance.objects.count(), 2)
        first_score = Balance.objects.all()[0]
        self.assertEqual(first_score.default_pass_count, 1)
        self.assertEqual(first_score.default_fail_count, 1)

    def test_should_record_consumption_for_each_facility(self):
        report = FakeReport()
        report.ads = defaultdict(list)
        report.pds = defaultdict(list)
        report.cycle = "May - Jun 2015"
        report.locs = [{
            'name': 'location_one',
            'IP': 'ip_one',
            'District': 'district_one',
            'Warehouse': 'warehouse_one',
            'Multiple': '',
            'status': '',
            'Web/Paper': '',
            'scores': defaultdict(dict)
        }]
        report.cs = {
            'location_one': [
                {
                    'opening_balance': 20,
                    'closing_balance': 12,
                }
            ]
        }
        self.assertEqual(Consumption.objects.count(), 0)
        persist_consumption(report)
        self.assertEqual(Consumption.objects.count(), 1)
        first_record = Consumption.objects.all()[0]
        self.assertEqual(first_record.name, 'location_one')
        self.assertEqual(first_record.ip, 'ip_one')
        self.assertEqual(first_record.district, 'district_one')
        self.assertEqual(first_record.warehouse, 'warehouse_one')
        self.assertEqual(first_record.opening_balance, 20)
        self.assertEqual(first_record.closing_balance, 12)

    def test_should_record_adult_records_for_each_facility(self):
        report = FakeReport()
        report.ads = defaultdict(list)
        report.pds = defaultdict(list)
        report.cycle = "May - Jun 2015"
        report.locs = [{
            'name': 'location_one',
            'IP': 'ip_one',
            'District': 'district_one',
            'Warehouse': 'warehouse_one',
            'Multiple': '',
            'status': '',
            'Web/Paper': '',
            'scores': defaultdict(dict)
        }]
        report.ads = {
            'location_one': [
                {
                    'new': 20,
                    'existing': 12,
                }
            ]
        }
        self.assertEqual(AdultPatientsRecord.objects.count(), 0)
        persist_adult_records(report)
        self.assertEqual(AdultPatientsRecord.objects.count(), 1)
        first_record = AdultPatientsRecord.objects.all()[0]
        self.assertEqual(first_record.name, 'location_one')
        self.assertEqual(first_record.ip, 'ip_one')
        self.assertEqual(first_record.district, 'district_one')
        self.assertEqual(first_record.warehouse, 'warehouse_one')
        self.assertEqual(first_record.new, 20)
        self.assertEqual(first_record.existing, 12)

    def test_should_record_paed_records_for_each_facility(self):
        report = FakeReport()
        report.ads = defaultdict(list)
        report.pds = defaultdict(list)
        report.cycle = "May - Jun 2015"
        report.locs = [{
            'name': 'location_one',
            'IP': 'ip_one',
            'District': 'district_one',
            'Warehouse': 'warehouse_one',
            'Multiple': '',
            'status': '',
            'Web/Paper': '',
            'scores': defaultdict(dict)
        }]
        report.pds = {
            'location_one': [
                {
                    'new': 20,
                    'existing': 12,
                }
            ]
        }
        self.assertEqual(PAEDPatientsRecord.objects.count(), 0)
        persist_paed_records(report)
        self.assertEqual(PAEDPatientsRecord.objects.count(), 1)
        first_record = PAEDPatientsRecord.objects.all()[0]
        self.assertEqual(first_record.name, 'location_one')
        self.assertEqual(first_record.ip, 'ip_one')
        self.assertEqual(first_record.district, 'district_one')
        self.assertEqual(first_record.warehouse, 'warehouse_one')
        self.assertEqual(first_record.new, 20)
        self.assertEqual(first_record.existing, 12)



    def test_should_record_facilities_with_multiple_orders(self):
        report = FakeReport()
        report.ads = defaultdict(list)
        report.pds = defaultdict(list)
        report.cycle = "May - Jun 2015"
        report.locs = [{
            'name': 'location_one',
            'IP': 'ip_one',
            'District': 'district_one',
            'Warehouse': 'warehouse_one',
            'Multiple': '',
            'status': '',
            'Web/Paper': '',
            'scores': defaultdict(dict)
        }, {
            'name': 'location_two',
            'IP': 'ip_one',
            'District': 'district_one',
            'Warehouse': 'warehouse_one',
            'Multiple': 'Multiple orders',
            'status': '',
            'Web/Paper': '',
            'scores': defaultdict(dict)
        }]
        self.assertEqual(MultipleOrderFacility.objects.count(), 0)
        persist_multiple_order_records(report)
        self.assertEqual(MultipleOrderFacility.objects.count(), 1)
