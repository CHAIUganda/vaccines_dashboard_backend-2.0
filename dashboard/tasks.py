import os

import pydash
from celery import shared_task

from dashboard.data.stock_report import StockReport
from dashboard.models import *


# def calculate_totals_in_month(report):
#     persist_totals(report)


# def persist_totals(report):
#     scores = list()
#     for facility in report.locs:
#         s = Stock(district=facility.get('District', None), month=report.month)
#         scores.append(s)
#     Stock.objects.filter(cycle=report.cycle).delete()
#     Stock.objects.bulk_create(scores)


@shared_task
def import_stock_report(path, year, month):
    report = StockReport(path, year, month)
    report = report.load()
    report.import_balances()
    report.import_orders()

