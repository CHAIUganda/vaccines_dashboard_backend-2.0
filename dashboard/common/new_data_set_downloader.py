from datetime import date
import requests
from vaccines.settings import DHIS2_NEW_USER, DHIS2_NEW_PASS
from dashboard.models import *

class NewDataSetDownloader(object):
    def __init__(self, url):
        self.url = url
        self.valid_data_elements = [de.identifier for de in DataElement.objects.all()]
    
    def is_valid_data_element(self, data_element):
        if data_element in self.valid_data_elements:
            return True

    def download(self):
        print ("---------Getting data from DHIS2---------")
        url = self.url
        result = requests.get(url, auth=(DHIS2_NEW_USER, DHIS2_NEW_PASS))
        print("---------Done fetching data from DHIS2---------")
        return result.json()

    def save_data_value(self, data_value):
        DHIS2Dataset.objects.update_or_create(
            org_unit=data_value['orgUnit'],
            dataelement=data_value['dataElement'],
            period=int(data_value['period']),
            attribute_option_combo=0,
            category_option_combo=0,
            defaults={'value': data_value['value']}
        )
        # Avoid old code by returning at this point, save_from_model() is now use apply stock data
        return

    # def bulk_import(self):
    #     from sqlalchemy import create_engine
    #     import pandas as pd
    #     from django.conf import settings

    #     data = self.download()
    #     # print(data)
    #     data_values = data["dataValues"]

    #     df = pd.read_json(json.dumps(self.get_data_values()))
    #     df = df[['', '', 'dataElement', 'orgUnit', 'period', 'value']]
    #     df.columns = ['attribute_option_combo', 'category_option_combo', 'dataelement', 'org_unit', 'period', 'value']

    #     DB_TYPE = 'postgresql'
    #     DB_DRIVER = 'psycopg2'
    #     DB_USER = settings.DATABASES['default']['USER']
    #     DB_PASS = settings.DATABASES['default']['PASSWORD']
    #     DB_HOST = settings.DATABASES['default']['HOST']
    #     DB_PORT = settings.DATABASES['default']['PORT']
    #     DB_NAME = settings.DATABASES['default']['NAME']
    #     POOL_SIZE = 50
    #     SQLALCHEMY_DATABASE_URI = '%s+%s://%s:%s@%s:%s/%s' % (DB_TYPE, DB_DRIVER, DB_USER,
    #                                                           DB_PASS, DB_HOST, DB_PORT, DB_NAME)
    #     db= create_engine(SQLALCHEMY_DATABASE_URI, pool_size=POOL_SIZE, max_overflow=0)
    #     print "Processing bulk import..."
    #     df.to_sql('dashboard_dhis2dataset', db, if_exists='append', index=False)
    #     print "Done."

    def parse_data(self):

        data = self.download()
        data_values = data["dataValues"]

        print("Parsing data ....")
        # Painfully slow but no time to write and test the bulk importer above.
        # Refactor lator
        for counter, value in enumerate(data_values):
            print ("Processing %s of %s" % (counter, len(data_values)))
            try:
                if not self.is_valid_data_element(value['dataElement']):
                    continue
                self.save_data_value(value)
            except Exception, e:
                print (e.message)
        
        print("Done parsing data")
