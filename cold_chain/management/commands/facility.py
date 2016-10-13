
from datetime import date
from django.core.management import BaseCommand

from cold_chain.models import *
from openpyxl import load_workbook


def import_facilities(excel_file):
    workbook = load_workbook(excel_file, read_only=True, use_iterators=True)
    worksheet_name = "tbl_facilities"
    workbook_results = workbook.get_sheet_by_name(worksheet_name)

    for row in workbook_results.iter_rows('A%s:F%s' % (workbook_results.min_row + 1, workbook_results.max_row)):
        facility = Facility()
        facility.code = row[0].value
        facility.name = row[4].value
        facility.district = row[1].value
        facility.sub_county = row[2].value
        facility.save()

class Command(BaseCommand):
    args = '<path to dataset file>'
    help = """ Import facility """

    def handle(self, *args, **options):
        excel_file = args[0]
        import_facilities(excel_file)