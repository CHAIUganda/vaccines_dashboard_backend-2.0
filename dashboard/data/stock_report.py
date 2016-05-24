import logging
from collections import defaultdict

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


class StockReport():
    def __init__(self, path, year, month):
        self.path = path
        self.year = year
        self.month = month
        self.vaccines = ["MEASLES", "BCG", "HPV", "HEPB", "TT", "TOPV", "YELLOW FEVER", "PCV", "PENTA"]
        self.name_cache = dict()
        self.stock = []

    def load(self):
        self.workbook = self.get_workbook()
        self.stock = self.load_stock()
        return self

    def get_workbook(self):
        return load_workbook(self.path, read_only=True, use_iterators=True)

    def load_stock(self):
        #Todo: use proper name
        location_sheet = self.workbook.get_sheet_by_name("JAN 2014")
        stock_data = []
        for row in location_sheet.iter_rows('B%s:J%s' % (location_sheet.min_row + 2, location_sheet.max_row)):
            if row[0].value:
                stock = dict()
                stock[YEAR] = self.year
                stock[MONTH] = self.month
                stock[DISTRICT] = row[0].value
                for vaccine in self.vaccines:
                    stock[VACCINE] = vaccine
                    col = self.vaccines.index(vaccine) + 1
                    value = row[col].value
                    if value:
                        stock[AT_HAND] = value
                        stock_data.append(stock)
        return stock_data


    def save(self):
        stock, created = Stock.objects.get_or_create("JAN 2014")
        stock.save()
        return stock


    def get_value(self, row, i):
        if i <= len(row):
            real_value = row[i].value
            value = real_value
            if value != "-" and value != '':
                return real_value



