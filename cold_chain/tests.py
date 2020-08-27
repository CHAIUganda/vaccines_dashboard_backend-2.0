from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from cold_chain.models import *
from dashboard.models import Facility


class TestTempMonitoring(APITestCase):
    def setUp(self):
        self.district = District.objects.create(name="Kampala District", identifier="kampala")
        self.district2 = District.objects.create(name="Jinja District", identifier="jinja")
        self.facility1 = Facility.objects.create(name="facility1", identifier="facility1")
        self.facility2 = Facility.objects.create(name="facility2", identifier="facility2")
        self.facility3 = Facility.objects.create(name="facility3", identifier="facility3")
        self.facility4 = Facility.objects.create(name="facility4", identifier="facility4")
        self.facility5 = Facility.objects.create(name="facility5", identifier="facility5")
        self.facility6 = Facility.objects.create(name="facility6", identifier="facility6")
        self.facility7 = Facility.objects.create(name="facility7", identifier="facility7")
        self.tempreport = TempReport.objects.create(district=self.district, month=1, year=2020, heat_alarm=3,
                                                    cold_alarm=3, facility=self.facility1)
        self.tempreport = TempReport.objects.create(district=self.district, month=1, year=2020, heat_alarm=1,
                                                    cold_alarm=0, facility=self.facility2)
        self.tempreport = TempReport.objects.create(district=self.district, month=1, year=2020, heat_alarm=0,
                                                    cold_alarm=0, facility=self.facility3)
        self.tempreport = TempReport.objects.create(district=self.district2, month=1, year=2020, heat_alarm=5,
                                                    cold_alarm=9, facility=self.facility4)
        self.tempreport = TempReport.objects.create(district=self.district2, month=2, year=2020, heat_alarm=2,
                                                    cold_alarm=7, facility=self.facility5)
        self.tempreport = TempReport.objects.create(district=self.district2, month=2, year=2020, heat_alarm=0,
                                                    cold_alarm=5, facility=self.facility6)
        self.tempreport = TempReport.objects.create(district=self.district, month=2, year=2020, heat_alarm=0,
                                                    cold_alarm=0, facility=self.facility1)
        self.tempreport = TempReport.objects.create(district=self.district2, month=1, year=2020, heat_alarm=0,
                                                    cold_alarm=0, facility=self.facility6)

    def test_temperature_reporting_rate_per_district(self):
        """
        Test temperature reporting data per district. Should only return data for single district
        """
        response_data = {
            "heat_graph_data": [
                {
                    "data": [
                        {
                            "submitted": 2,
                            "total": 3,
                            "month": 1
                        },
                        {
                            "submitted": 0,
                            "total": 1,
                            "month": 2
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 3
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 4
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 5
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 6
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 7
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 8
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 9
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 10
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 11
                        },
                        {
                            "submitted": 0,
                            "total": 0,
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
        self.assertEqual(response.json(), response_data)

    def test_temperature_reporting_rate_at_national_level(self):
        """
        Test temperature reporting data for all districts. Should return data for all district
        """
        response_data = {
            "heat_graph_data": [
                {
                    "data": [
                        {
                            "submitted": 2,
                            "total": 3,
                            "month": 1
                        },
                        {
                            "submitted": 0,
                            "total": 1,
                            "month": 2
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 3
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 4
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 5
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 6
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 7
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 8
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 9
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 10
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 11
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 12
                        }
                    ],
                    "district": "Kampala District"
                },
                {
                    "data": [
                        {
                            "submitted": 1,
                            "total": 2,
                            "month": 1
                        },
                        {
                            "submitted": 2,
                            "total": 2,
                            "month": 2
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 3
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 4
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 5
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 6
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 7
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 8
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 9
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 10
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 11
                        },
                        {
                            "submitted": 0,
                            "total": 0,
                            "month": 12
                        }
                    ],
                    "district": "Jinja District"
                }
            ],
            "submission_percentages_graph_data": [
                {
                    "submissions_percentages": {
                        "1": 60,
                        "2": 67,
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
                        "1": 3,
                        "2": 2,
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
        kwargs = {"year": 2020, "district": "national"}
        url = reverse("tempreportingrate")
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)
