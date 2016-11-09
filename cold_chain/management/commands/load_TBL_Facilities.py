
from datetime import date
from django.core.management import BaseCommand

from cold_chain.models import *
from openpyxl import load_workbook


def import_tab_facilities(excel_file):
    workbook = load_workbook(excel_file, read_only=True, use_iterators=True)
    worksheet_name = "type"
    workbook_results = workbook.get_sheet_by_name(worksheet_name)

    for row in workbook_results.iter_rows('A%s:J%s' % (workbook_results.min_row + 1, workbook_results.max_row)):
        facility_type = FacilityType()
        facility_type.facility_type_id = row[0].value
        facility_type.name = row[1].value
        facility_type.group = row[7].value
        facility_type.save()

class Command(BaseCommand):
    args = '<path to dataset file>'
    help = """ Import facility_type """

    def handle(self, *args, **options):
        excel_file = args[0]
        import_tab_facilities(excel_file)