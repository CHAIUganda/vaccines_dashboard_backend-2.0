from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from cold_chain.models import *
from dashboard.models import Facility, Region
from django.utils.crypto import get_random_string
from django.utils import timezone


class Test(APITestCase):
    """
    Run tests using these commands
    docker exec -it vc_dashboard_vaccines_1 /bin/bash
    python ./manage.py test -v=1 cold_chain
    """

    def setUp(self):
        # todo add test to remove national, district stores and Sub-District Store
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
        self.district5 = District.objects.create(name="Gulu District", identifier="gulu", region=self.northern_region)
        self.facility1 = Facility.objects.create(name="facility1", identifier="facility1")

    def test_stock_at_hand_by_district(self):
        # todo fix test
        response_data = [
            {
                "ordered": 0.0,
                "max_variance": -10420.0,
                "coverage_rate": 54,
                "period": 201801,
                "Months_stock": 0,
                "stock_requirement__target": 4123,
                "at_hand": 0.0,
                "period_month": 1,
                "planned_consumption": 0.0,
                "uptake_rate": 55,
                "stock_requirement__district__zone": 3,
                "stock_requirement__maximum": 10420,
                "stock_requirement__coverage_target": 3091,
                "min_variance": -6530.0,
                "period_year": 2018,
                "available_stock": 4000,
                "vaccine": "MEASLES",
                "received": 4000.0,
                "stock_requirement__minimum": 6530,
                "district_name": "Arua District",
                "Refill_rate": 0,
                "consumed": 2238.0,
                "not_immunized": 1885.0
            }
        ]

        kwargs = {"startMonth": "Nov 2014", "endMonth": "Jan 2018", "district": "Arua District"}
        url = reverse("stock_at_hand_by_district")
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)

    def test_stock_at_hand_by_month(self):
        # todo fix test
        response_data = [
            {
                "max_variance": -2420.0,
                "ordered": 0.0,
                "period_year": 2017,
                "at_hand": 0.0,
                "stock_requirement__coverage_target": 457,
                "stock_requirement__minimum": 605,
                "period": 201712,
                "period_month": 12,
                "min_variance": -605.0,
                "stock_requirement__target": 457,
                "district_name": "Abim District",
                "stock_requirement__maximum": 2420,
                "consumed": 1260.0,
                "vaccine": "OPV"
            }
        ]

        kwargs = {"startMonth": "Nov 2014", "endMonth": "Jan 2018", "district": "Arua District"}
        url = reverse("stock_at_hand_by_month")
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)

    def test_stockbydistrictvaccine(self):
        response_data = [
            {
                "received": 11290.0,
                "stock_requirement__maximum": 12450,
                "at_hand": 2000.0,
                "stock_requirement__coverage_target": 2973,
                "stock_requirement__minimum": 3112,
                "stock_requirement__district__name": "Arua District",
                "period": 201606,
                "month": 6,
                "stock_requirement__target": 8919,
                "ordered": 11300.0,
                "stock_requirement__vaccine__name": "PENTA",
                "consumed": 7172.0,
                "stock_requirement__district__zone": 3
            }
        ]

        kwargs = {"startMonth": "Nov 2014", "endMonth": "Jan 2018", "district": "Arua District", "vaccine": "PENTA"}
        url = reverse("stock_by_district_vaccine")
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)

