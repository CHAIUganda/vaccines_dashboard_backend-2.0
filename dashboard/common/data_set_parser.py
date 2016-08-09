import json
from datetime import date

from django.db import IntegrityError
from dashboard import utils
from dashboard.models import *


class DataSetParser(object):

    def __init__(self, data_set, period):
        self.data_set = data_set
        self.period = period
        self.valid_data_elements = [de.identifier for de in DataElement.objects.all()]

    def get_data_values(self):
        data_set_file_name = utils.get_data_set_file_path(self.data_set.identifier, self.period)
       # print data_set_file_name
        data_set_contents = json.load(open(data_set_file_name, "r"))
        return data_set_contents['dataValues']

    def parse(self):
        data_values = self.get_data_values()
        print "Started..."

        for value in data_values:
            try:
                if not self.is_valid_data_element(value['dataElement']):
                    continue
                self.save_data_value(value)
            except Exception, e:
                print e.message
        print "Done."

    def is_valid_data_element(self, data_element):
        if data_element in self.valid_data_elements:
            return True

    def save_data_value(self, data_value):
        if data_value['value'] == 0:
            pass

        data_element = DataElement.objects.get(identifier=data_value['dataElement'])
        facility = Facility.objects.filter(identifier=data_value['orgUnit']).first()

        if facility:
            district = facility.sub_county.district
            region = district.region

        else:
            district_item = District.objects.filter(identifier=data_value['orgUnit']).first()
            if district_item:
                district = district_item
                region = district_item.region
            else:
                sub_county = District.objects.filter(identifier=data_value['orgUnit']).first()
                district = sub_county.district
                region = sub_county.region

        #Get vaccine category
        vaccine_category = VaccineCategory.objects.filter(data_element_id=data_element.id, vaccine__index__gt=0).first()
        if vaccine_category:
            print "Sub County:%s in (%s) value: %s vaccine: %s" % \
                  (facility.sub_county, district, data_value['value'], vaccine_category.vaccine)
            year = int(data_value['period'][0:4])
            month = int(data_value['period'][4:])

            stock_requirement = StockRequirement.objects.filter(
                                                district__name__contains=district.name,
                                                vaccine__name=vaccine_category.vaccine.name,
                                                year=year,
                                            ).first()
            try:
                if stock_requirement:
                    stock, created = Stock.objects.update_or_create(
                                        stock_requirement = stock_requirement,
                                        month=month,
                                        period=int(self.period),
                                        defaults={'firstdate': date(year, month, 1),
                                                  'lastdate': date(year, month, LAST_MONTH_DAY[month]),
                                                  'data_element': data_element,
                                                  'consumed': data_value['value']},
                                    )
                    stock_requirement.save()
            except IntegrityError, e:
                print "| Failing..."
