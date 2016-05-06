import os

import pydash
from celery import shared_task

from dashboard.data.free_form_report import FreeFormReport
from dashboard.models import Balance, YearMonth


def calculate_totals_in_month(report):
    persist_totals(report)


def persist_totals(report):
    scores = list()
    for facility in report.locs:
        s = Balance(
            district=facility.get('District', None),
            year_month=report.year_month)
        scores.append(s)
    Balance.objects.filter(cycle=report.cycle).delete()
    Balance.objects.bulk_create(scores)


@shared_task
def import_general_report(path, year_month):
    report = FreeFormReport(path, year_month).load()
    report.save()
    os.remove(path)
    calculate_totals_in_month(report)
