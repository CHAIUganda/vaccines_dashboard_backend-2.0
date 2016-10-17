from datetime import date
from django.core.management import BaseCommand

from cold_chain.models import *
from openpyxl import load_workbook


def import_functionality(excel_file):
    workbook = load_workbook(excel_file, read_only=True, use_iterators=True)
    worksheet_name = "functionality"
    workbook_results = workbook.get_sheet_by_name(worksheet_name)

    for row in workbook_results.iter_rows('A%s:N%s' % (workbook_results.min_row + 4, workbook_results.max_row)):
        try:
            fn = Functionality()
            ft = Facility.objects.get(code=row[0].value)
            fn.facility = ft
            fn.working_well = row[11].value
            fn.needs_maintenance = row[12].value
            fn.not_working = row[13].value
            fn.number_existing = row[10].value
            fn.save()
        except Facility.DoesNotExist:
            fn.working_well = row[11].value
            fn.needs_maintenance = row[12].value
            fn.not_working = row[13].value
            fn.number_existing = row[10].value
            fn.save()

class Command(BaseCommand):
    args = '<path to dataset file>'
    help = """ Import functionality """

    def handle(self, *args, **options):
        excel_file = args[0]
        import_functionality(excel_file)