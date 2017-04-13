from django.core.management import BaseCommand

from planning.models import *
from openpyxl import load_workbook


def import_plannedactivities(excel_file, quarter):
    workbook = load_workbook(excel_file, read_only=True, use_iterators=True)
    worksheet_name = "AWP 2017"
    workbook_results = workbook.get_sheet_by_name(worksheet_name)

    for row in workbook_results.iter_rows('A%s:J%s' % (workbook_results.min_row + 4, workbook_results.max_row)):
        try:
            pa = PlannedActivities()
            pa.area = row[0].value
            pa.description
            fn.facility = ft
            fn.working_well = row[11].value
            fn.needs_maintenance = row[12].value
            fn.not_working = row[13].value
            fn.number_existing = row[10].value
            fn.quarter = quarter
            fn.save()
        except Facility.DoesNotExist:
            fn.working_well = row[11].value
            fn.needs_maintenance = row[12].value
            fn.not_working = row[13].value
            fn.number_existing = row[10].value
            fn.quarter = quarter
            fn.save()

class Command(BaseCommand):
    args = '<path to dataset file>'
    help = """ Import functionality """

    def handle(self, *args, **options):
        excel_file = args[0]
        quarter = args[1]
        import_functionality(excel_file, quarter)