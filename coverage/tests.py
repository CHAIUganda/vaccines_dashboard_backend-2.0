from django.test import TestCase

# Create your tests here.
from rest_framework import status

from dashboard.models import Region, District


class TestCoverage(TestCase):
    def setUp(self):
        # todo add data needed for the tests
        self.central_region = Region.objects.create(name="Central Region", identifier="central")
        self.eastern_region = Region.objects.create(name="Eastern Region", identifier="eastern")
        self.western_region = Region.objects.create(name="Western Region", identifier="western")
        self.northern_region = Region.objects.create(name="Northern Region", identifier="northern")
        self.district = District.objects.create(name="Kampala District", identifier="kampala",
                                                region=self.central_region)
        self.district2 = District.objects.create(name="Jinja District", identifier="jinja", region=self.eastern_region)
        self.district3 = District.objects.create(name="Masaka District", identifier="masaka",
                                                 region=self.central_region)
        self.district4 = District.objects.create(name="Mbarara District", identifier="mbarara",
                                                 region=self.western_region)

    def test_vaccinedoses_by_period(self):
        # todo fix test and add more parameters
        url = reversed('vaccinedoses_by_period')
        response_data = [
            {
                "total_actual": 115946,
                "total_last_dose": 115946,
                "total_planned": 130668.0,
                "period": 201801,
                "total_third_dose": 115946,
                "total_second_dose": 114326,
                "total_first_dose": 125626,
                "vaccine__name": "PENTA"
            },
            {
                "total_actual": 123457,
                "total_last_dose": 123457,
                "total_planned": 147384.0,
                "period": 201801,
                "total_third_dose": 0,
                "total_second_dose": 0,
                "total_first_dose": 123457,
                "vaccine__name": "BCG"
            }
        ]

        # fix period, start and end year conflict
        kwargs = {"startYear": 2019, "endYear": 2020, "period": 20219, "region": "Central Region"}
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)
