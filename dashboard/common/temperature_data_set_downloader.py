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
                subcounty_id=data_value["subcounty_id"],
                facility_id=data_value["facility_id"]
            )

        except Exception as e:
            raise e

    def parse_temperature_data(self):
        # Data format as below
        # {
        # "id": "IzNVm36SLyF",
        # "displayName": "105-CC01. High Temperature alarms"
        # },
        # {
        # "id": "gu6piypvpy4",
        # "displayName": "105-CC02. Low Temperature alarms"
        # },

        data = self.download()
        data_values = data["dataValues"]
        seen = (set())  # set for fast O(1) amortized lookup, used in keeping looped values so we can check for duplicates and determine if the value is a heat / cold alarm
        payload = []

        print("Parsing temperature data......")

        for counter, value in enumerate(data_values):

            try:
                facility = Facility.objects.get(identifier=value['orgUnit'])
            except Exception as e:
                print(e)
                continue

            district = facility

            if (district.sub_county is not None):
                subcounty = district.sub_county
                district = district.sub_county.district
                year = int(str(value["period"])[0:4])
                month = int(str(value["period"])[4:])
                key = (value["orgUnit"])

                try:
                    if key not in seen and value["dataElement"] == "IzNVm36SLyF":  # For high temperature alarms, id is IzNVm36SLyF

                        payload.append({
                            "district_id": district.id,
                            "district_identifier": district.identifier,
                            "subcounty_id": subcounty.id,
                            "subcounty_identifier": subcounty.identifier,
                            "facility_id": facility.id,
                            "facility_identifier": facility.identifier,
                            "year": year,
                            "month": month,
                            "heat_alarm": value['value'],
                            "cold_alarm": 0
                        })
                        seen.add(key)
                    elif key in seen and value["dataElement"] == "gu6piypvpy4":  # For low temperature alarms, id is gu6piypvpy4
                        # Get district matching this Id in payload already created
                        district_payload = [x for x in payload if district.identifier == x["district_identifier"]]

                        # district_payload is a list, so we access the dict inside by index 0 and add the cold_alarm value
                        district_payload[0]["cold_alarm"] = value['value']

                except Exception as e:
                    raise e
            else:
                # There are instances in the data where the Health Facilities are not attached to any subcounty, and ultimately district.
                # print("%s : %s is not attached to any subcounty" % (value['orgUnit'], district))
                pass

        for counter, value in enumerate(payload):
            try:
                print("Processing %s of %s" % (counter, len(payload)))
                self.save_data_value(value)
            except Exception, e:
                print(e.message)

        print("Done importing Temperature Monitoring Data")
