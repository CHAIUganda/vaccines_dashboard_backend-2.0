from datetime import date
import requests
from vaccines.settings import DHIS2_NEW_USER, DHIS2_NEW_PASS
from dashboard.models import *
from cold_chain.models import TempReport

class TemperatureDataSetDownloader(object):
    def __init__(self, url):
        self.url = url

    def download(self):
        url = self.url
        data = requests.get(url, auth=(DHIS2_NEW_USER, DHIS2_NEW_PASS))
        return data.json()

    def save_data_value(self, data_value):
        try:
            TempReport.objects.update_or_create(
                heat_alarm=float(data_value["heat_alarm"]),
                cold_alarm=float(data_value["cold_alarm"]),
                year=data_value["year"],
                month=data_value["month"],
                district_id=data_value["district_id"],
            )
        except Exception as e:
            raise e

    def parse_temperature_data(self):
        data = self.download()
        data_values = data["dataValues"]
        seen = (set())  # set for fast O(1) amortized lookup, used in keeping looped values so we can check for duplicates and determine if the value is a heat / cold alarm
        payload = []

        print("Parsing temperature data......")

        for counter, value in enumerate(data_values):
            district = District.objects.get(identifier=value['orgUnit'])
            year = int(str(value["period"])[0:4])
            month = int(str(value["period"])[4:])
            key = (value["orgUnit"])

            try:
                if key not in seen and value["dataElement"] == "nd7C34i9jx0":  # For heat alarms, id is nd7C34i9jx0
                    payload.append({
                        "district_id": district.id,
                        "district_identifier": district.identifier,
                        "year": year,
                        "month": month,
                        "heat_alarm": value['value'],
                        "cold_alarm": 0
                    })
                    seen.add(key)
                elif key in seen and value["dataElement"] == "go8OvDHyKzh":  # For cold alarms, id is go8OvDHyKzh
                    # Get district matching this Id in payload already created
                    district_payload = [x for x in payload if district.identifier == x["district_identifier"]]

                    # district_payload is a list, so we access the dict inside by index 0 and add the cold_alarm value
                    district_payload[0]["cold_alarm"] = value['value']

            except Exception as e:
                raise e

        for counter, value in enumerate(payload):
            print("Processing %s of %s" % (counter, len(payload)))
            try:
                self.save_data_value(value)
            except Exception, e:
                print(e.message)

        print("Done importing Temperature Monitoring Data")
