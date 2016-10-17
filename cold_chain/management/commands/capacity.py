from datetime import date
from django.core.management import BaseCommand

from cold_chain.models import *
from openpyxl import load_workbook


def import_capacity(excel_file):
    workbook = load_workbook(excel_file, read_only=True, use_iterators=True)
    worksheet_name = "capacity"
    workbook_results = workbook.get_sheet_by_name(worksheet_name)

    for row in workbook_results.iter_rows('A%s:L%s' % (workbook_results.min_row + 6, workbook_results.max_row)):
        fc = Capacity()
        fc.actual = row[4].value
        fc.required = row[5].value
        fc.difference = row[6].value
        ft = Facility.objects.filter(facility_code=row[0].value)
        fc.facility = ft
        fc.save()

class Command(BaseCommand):
    args = '<path to dataset file>'
    help = """ Import capacity """

    def handle(self, *args, **options):
        excel_file = args[0]
        import_capacity(excel_file)