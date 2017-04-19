from django.core.management import BaseCommand

from planning.models import *
from openpyxl import load_workbook


def import_PlanActivities(excel_file, year):
    workbook = load_workbook(excel_file, read_only=True, use_iterators=True)
    worksheet_name = "AWP 2017"
    workbook_results = workbook.get_sheet_by_name(worksheet_name)

    for row in workbook_results.iter_rows('A%s:J%s' % (workbook_results.min_row + 4, workbook_results.max_row)):
            pa = PlanActivities()
            pa.area = row[0].value
            pa.description = row[2].value
            pa.fund = row[4].value
            pa.priority =row[5].value
            pa.timeframe =row[9].value
            pa.save()
            print "Completed"

class Command(BaseCommand):
    args = '<path to dataset file>'
    help = """ Import planactivities """

    def handle(self, *args, **options):
        excel_file = args[0]
        year = args[1]
        import_PlanActivities(excel_file, year)