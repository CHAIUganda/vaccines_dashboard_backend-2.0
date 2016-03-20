import os
from optparse import make_option

import pandas as pd
from django.core.management import BaseCommand
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.db import transaction
from django.utils import timezone
from django.db import IntegrityError
from home.models import DistrictBalance
from home.utils import month_to_num


class Command(BaseCommand):
    args = '<path to dataset file>'
    help = """ Import balances and orders data  """

    def exists(self, month, year):
        if DistrictBalance.objects.filter(month == month, year==year).exists():
            return True
        else:
            return False

    def handle(self, *args, **options):
        for datafile in args:
            try:
                print(datafile)
                df = pd.ExcelFile(datafile)

                sheets = []
                sheets.append(df.parse(sheetname=0, skiprows=1))
            except:
                print('error')
                raise

            sheets_names = df.sheet_names
            #print(sheets_names)

            # for idx, val in enumerate(sheets_names):
            #     print(idx)
            #     print(val)

            sheet_name = 'DEC 2013'
            df = sheets[0]

            df = df.ix[:, 1:11]
            df = df[df.DISTRICT.notnull()]
            month, year = sheet_name.split()

            if self.exists(month=month, year=year):
                for row in df.index:
                    for idx, column_name in enumerate(df.columns):
                        if idx > 0:
                            balance = DistrictBalance()
                            balance.month = month_to_num(month)
                            balance.year = year
                            balance.district_name = df['DISTRICT'][row]
                            balance.vaccine_name = column_name
                            balance.dose = df[column_name][row]
                            balance.save()
