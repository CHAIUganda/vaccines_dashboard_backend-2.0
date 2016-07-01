import logging
from collections import defaultdict

import datetime
from openpyxl import load_workbook

from dashboard.helpers import *
from dashboard.models import *

logger = logging.getLogger(__name__)


def get_real_facility_name(facility_name, district_name):
    if facility_name:
        template = "_%s" % district_name
        return facility_name.replace(template, "")
    else:
        return facility_name


class StockReport:
    def __init__(self, path, year, month):
        self.path = path
        self.year = year
        self.month = month
        self.month_name = MONTHS_TO_STR[int(self.month)]
        self.month_name = self.month_name.upper()
        self.vaccines = ["MEASLES", "BCG", "HPV", "HEPB", "TT", "TOPV", "YELLOW FEVER", "PCV", "PENTA"]


    def load(self):
        self.workbook = self.get_workbook()
        return self

    def get_workbook(self):
        return load_workbook(self.path, read_only=True, use_iterators=True)

    def import_balances(self):
        #Todo: use proper name
        worksheet_name = "%s %s" % (self.month_name, self.year)
        location_sheet = self.workbook.get_sheet_by_name(worksheet_name)
        for row in location_sheet.iter_rows('B%s:K%s' % (location_sheet.min_row + 2, location_sheet.max_row)):
            if row[0].value:
                for vaccine in self.vaccines:
                    col = self.vaccines.index(vaccine)+ 1
                    #data = row[9].value
                    value = row[col].value
                    if value:
                        stock, created = Stock.objects.update_or_create(
                            district=row[0].value,
                            vaccine=vaccine,
                            year=self.year,
                            month=self.month,
                            at_hand=value,
                            defaults= {'firstdate':datetime.datetime(int(self.year), int(self.month),1),
                                'lastdate':datetime.datetime(int(self.year), int(self.month), LAST_MONTH_DAY[int(self.month) + 1])},
                        )



    def import_orders(self):
        #Todo: use proper name
        worksheet_name = "%s %s" % (self.month_name, self.year)
        location_sheet = self.workbook.get_sheet_by_name(worksheet_name)
        for row in location_sheet.iter_rows('B%s:AC%s' % (location_sheet.min_row + 2, location_sheet.max_row)):
            if row[0].value:
                for vaccine in self.vaccines:
                    col = self.vaccines.index(vaccine) + 18
                    value = row[col].value
                    if value:
                        stock, created = Stock.objects.update_or_create(
                            district=row[0].value,
                            vaccine=vaccine,
                            year=self.year,
                            month=self.month,
                            defaults={'firstdate':datetime.datetime(int(self.year), int(self.month), 1),
                                'lastdate':datetime.datetime(int(self.year), int(self.month), LAST_MONTH_DAY[int(self.month) + 1]),
                                'ordered':value},
                        )



    def get_value(self, row, i):
        if i <= len(row):
            real_value = row[i].value
            value = real_value
            if value != "-" and value != '':
                return real_value
