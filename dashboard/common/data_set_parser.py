import json
from django.db import IntegrityError
from dashboard import utils
from dashboard.models import DataElement, DataValue, Facility, District, Region  #CategoryOptionCombo


class DataSetParser(object):

    def __init__(self, data_set, period):
        self.data_set = data_set
        self.period = period
        self.valid_data_elements = [de.identifier for de in DataElement.objects.all()]

    def get_data_values(self):
        data_set_file_name = utils.get_data_set_file_path(self.data_set.identifier, self.period)
        data_set_contents = json.load(open(data_set_file_name, "r"))
        return data_set_contents['dataValues']

    def parse(self):
        data_values = self.get_data_values()
        print "Loading data..."
        
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
        data_element = DataElement.objects.get(identifier=data_value['dataElement'])
        facility = Facility.objects.filter(identifier=data_value['orgUnit']).first()
        print "sub county:%s" % (facility.sub_county,)

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

        try:
            dv = DataValue()
            dv.data_set = self.data_set
            dv.facility = facility
            dv.district = district
            dv.region = region
            dv.data_element = data_element
            dv.period = int(self.period)
            dv.original_period = data_value['period']
            dv.value = data_value['value']
            dv.save()
        except IntegrityError, e:
            dv = DataValue.objects.get(facility=facility, data_element=data_element,
                                       period=self.period)
            dv.value = data_value['value']
            dv.save()