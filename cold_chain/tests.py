from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from cold_chain.models import *
from dashboard.models import Facility


class TestTempMonitoring(APITestCase):
    def setUp(self):
        self.district = District.objects.create(name="Kampala District")
        self.facility1 = Facility.objects.create(name="facility1", identifier="facility1")
        self.facility2= Facility.objects.create(name="facility2", identifier="facility2")
        self.facility3 = Facility.objects.create(name="facility3", identifier="facility3")
        self.tempreport = TempReport.objects.create(district=self.district, month=1, year=2020, heat_alarm=3, cold_alarm=3, facility=self.facility1)
        self.tempreport = TempReport.objects.create(district=self.district, month=1, year=2020, heat_alarm=1, cold_alarm=0, facility=self.facility2)
        self.tempreport = TempReport.objects.create(district=self.district, month=1, year=2020, heat_alarm=0, cold_alarm=0, facility=self.facility3)

    def test_temperature_reporting_rate_per_district(self):
        """
        Test temperature reporting data per district. Should only return data for single district
        """
        response_data = {
            "heat_graph_data": [
                {
                    "data": [
                        {
                            "submitted": True,
                            "month": 1
                        },
                        {
                            "submitted": False,
                            "month": 2
                        },
                        {
                            "submitted": False,
                            "month": 3
                        },
                        {
                            "submitted": False,
                            "month": 4
                        },
                        {
                            "submitted": False,
                            "month": 5
                        },
                        {
                            "submitted": False,
                            "month": 6
                        },
                        {
                            "submitted": False,
                            "month": 7
                        },
                        {
                            "submitted": False,
                            "month": 8
                        },
                        {
                            "submitted": False,
                            "month": 9
                        },
                        {
                            "submitted": False,
                            "month": 10
                        },
                        {
                            "submitted": False,
                            "month": 11
                        },
                        {
                            "submitted": False,
                            "month": 12
                        }
                    ],
                    "district": "Kampala District"
                }
            ],
            "submission_percentages_graph_data": [
                {
                    "submissions_percentages": {
                        "1": 67,
                        "2": 0,
                        "3": 0,
                        "4": 0,
                        "5": 0,
                        "6": 0,
                        "7": 0,
                        "8": 0,
                        "9": 0,
                        "10": 0,
                        "11": 0,
                        "12": 0
                    },
                    "monthly_submissions": {
                        "1": 2,
                        "2": 0,
                        "3": 0,
                        "4": 0,
                        "5": 0,
                        "6": 0,
                        "7": 0,
                        "8": 0,
                        "9": 0,
                        "10": 0,
                        "11": 0,
                        "12": 0
                    }
                }
            ]
        }
        kwargs = {"year": 2020, "district": "kampala"}
        url = reverse("tempreportingrate")
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print(response.json())
        print(response_data)
        self.assertEqual(response.json(), response_data)
