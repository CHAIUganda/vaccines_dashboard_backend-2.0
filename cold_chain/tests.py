from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from cold_chain.models import *
from dashboard.models import Facility, Region
from django.utils.crypto import get_random_string
from django.utils import timezone


class TestTempMonitoring(APITestCase):
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

        self.district_store_facility_type = FacilityType.objects.create(name='District Store')
        self.public_hciv_facility_type = FacilityType.objects.create(name='Public HCIV')

        self.coldchain_facility_ds = ColdChainFacility.objects.create(name="coldfacility1", district=self.district,
                                                                      code=get_random_string(length=12),
                                                                      type=self.district_store_facility_type)
        self.coldchain_facility2 = ColdChainFacility.objects.create(name="coldfacility2", district=self.district2,
                                                                    code=get_random_string(length=12),
                                                                    type=self.public_hciv_facility_type)
        self.coldchain_facility3 = ColdChainFacility.objects.create(name="coldfacility3", district=self.district3,
                                                                    code=get_random_string(length=12),
                                                                    type=self.public_hciv_facility_type)
        self.coldchain_facility4 = ColdChainFacility.objects.create(name="coldfacility4", district=self.district3,
                                                                    code=get_random_string(length=12),
                                                                    type=self.public_hciv_facility_type)
        self.coldchain_facility5 = ColdChainFacility.objects.create(name="coldfacility5", district=self.district,
                                                                    code=get_random_string(length=12),
                                                                    type=self.public_hciv_facility_type)
        self.coldchain_facility6_ds = ColdChainFacility.objects.create(name="coldfacility6", district=self.district2,
                                                                       code=get_random_string(length=12),
                                                                       type=self.district_store_facility_type)
        self.coldchain_facility7_ds = ColdChainFacility.objects.create(name="coldfacility7", district=self.district3,
                                                                       code=get_random_string(length=12),
                                                                       type=self.district_store_facility_type)
        self.coldchain_facility8_ds = ColdChainFacility.objects.create(name="coldfacility8", district=self.district4,
                                                                       code=get_random_string(length=12),
                                                                       type=self.district_store_facility_type)
        self.coldchain_facility9 = ColdChainFacility.objects.create(name="coldfacility9", district=self.district4,
                                                                    code=get_random_string(length=12),
                                                                    type=self.public_hciv_facility_type)
        self.coldchain_facility10 = ColdChainFacility.objects.create(name="coldfacility10", district=self.district4,
                                                                     code=get_random_string(length=12),
                                                                     type=self.public_hciv_facility_type)

        self.refrigerator = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility_ds,
                                                        serial_number="test1", make="SONY",
                                                        model="test1", supply_year=timezone.datetime(2009, 4, 4))
        self.refrigerator_detail = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator,
                                                                     district=self.district,
                                                                     available_net_storage_volume=372, temperature=4,
                                                                     required_net_storage_volume=373,
                                                                     functionality_status=FUNCTIONALITY_STATUS[0])

        self.refrigerator2 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility_ds,
                                                         serial_number=get_random_string(length=8), make="SONY",
                                                         model=get_random_string(length=5),
                                                         supply_year=timezone.datetime(2009, 4, 4))
        self.refrigerator_detail2 = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator2,
                                                                      district=self.district,
                                                                      available_net_storage_volume=674, temperature=4,
                                                                      required_net_storage_volume=673,
                                                                      functionality_status=FUNCTIONALITY_STATUS[0])

        self.refrigerator3 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility_ds,
                                                         serial_number=get_random_string(length=8), make="SONY",
                                                         model=get_random_string(length=5),
                                                         supply_year=timezone.datetime(2019, 4, 4))
        self.refrigerator_detail3 = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator3,
                                                                      district=self.district,
                                                                      available_net_storage_volume=674, temperature=4,
                                                                      required_net_storage_volume=673,
                                                                      functionality_status=FUNCTIONALITY_STATUS[0])

        self.refrigerator4 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility2,
                                                         serial_number=get_random_string(length=8), make="SONY",
                                                         model=get_random_string(length=5),
                                                         supply_year=timezone.datetime(2009, 4, 4))
        self.refrigerator_detail4 = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator4,
                                                                      district=self.district2,
                                                                      available_net_storage_volume=691, temperature=4,
                                                                      required_net_storage_volume=573,
                                                                      functionality_status=FUNCTIONALITY_STATUS[0])

        self.refrigerator5 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility2,
                                                         serial_number=get_random_string(length=8), make="SONY",
                                                         model=get_random_string(length=5),
                                                         supply_year=timezone.datetime(2019, 4, 4))
        self.refrigerator_detail5 = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator5,
                                                                      district=self.district2,
                                                                      available_net_storage_volume=491, temperature=5,
                                                                      required_net_storage_volume=778,
                                                                      functionality_status=FUNCTIONALITY_STATUS[0])

        self.refrigerator6 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility3,
                                                         serial_number=get_random_string(length=8), make="SONY",
                                                         model=get_random_string(length=5),
                                                         supply_year=timezone.datetime(2009, 4, 4))
        self.refrigerator_detail6 = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator6,
                                                                      district=self.district3,
                                                                      available_net_storage_volume=691, temperature=4,
                                                                      required_net_storage_volume=573,
                                                                      functionality_status=FUNCTIONALITY_STATUS[0])

        self.refrigerator7 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility3,
                                                         serial_number=get_random_string(length=8), make="SONY",
                                                         model=get_random_string(length=5),
                                                         supply_year=timezone.datetime(2019, 4, 4))
        self.refrigerator_detail7 = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator7,
                                                                      district=self.district3,
                                                                      available_net_storage_volume=891, temperature=5,
                                                                      required_net_storage_volume=778,
                                                                      functionality_status=FUNCTIONALITY_STATUS[1])

        self.refrigerator8 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility6_ds,
                                                         serial_number=get_random_string(length=8), make="SONY",
                                                         model=get_random_string(length=5),
                                                         supply_year=timezone.datetime(2019, 4, 4))
        self.refrigerator_detail8 = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator8,
                                                                      district=self.district3,
                                                                      available_net_storage_volume=121, temperature=5,
                                                                      required_net_storage_volume=778,
                                                                      functionality_status=FUNCTIONALITY_STATUS[1])

        self.refrigerator9 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility6_ds,
                                                         serial_number=get_random_string(length=8), make="SONY",
                                                         model=get_random_string(length=5),
                                                         supply_year=timezone.datetime(2009, 4, 4))
        self.refrigerator_detail9 = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator9,
                                                                      district=self.district3,
                                                                      available_net_storage_volume=191, temperature=5,
                                                                      required_net_storage_volume=1778,
                                                                      functionality_status=FUNCTIONALITY_STATUS[0])

        self.refrigerator10 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility6_ds,
                                                          serial_number=get_random_string(length=8), make="SONY",
                                                          model=get_random_string(length=5),
                                                          supply_year=timezone.datetime(2019, 4, 4))
        self.refrigerator_detail10 = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator10,
                                                                       district=self.district3,
                                                                       available_net_storage_volume=191, temperature=5,
                                                                       required_net_storage_volume=778,
                                                                       functionality_status=FUNCTIONALITY_STATUS[0])

        self.refrigerator11 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility9,
                                                          serial_number=get_random_string(length=8), make="SONY",
                                                          model=get_random_string(length=5),
                                                          supply_year=timezone.datetime(2009, 4, 4))
        self.refrigerator_detail11 = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator11,
                                                                       district=self.district4,
                                                                       available_net_storage_volume=791, temperature=5,
                                                                       required_net_storage_volume=778,
                                                                       functionality_status=FUNCTIONALITY_STATUS[0])

        self.refrigerator12 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility8_ds,
                                                          serial_number=get_random_string(length=8), make="SONY",
                                                          model=get_random_string(length=5),
                                                          supply_year=timezone.datetime(2019, 4, 4))
        self.refrigerator_detail12 = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator12,
                                                                       district=self.district4,
                                                                       available_net_storage_volume=791, temperature=5,
                                                                       required_net_storage_volume=778,
                                                                       functionality_status=FUNCTIONALITY_STATUS[0])

        self.refrigerator13 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility10,
                                                          serial_number=get_random_string(length=8), make="SONY",
                                                          model=get_random_string(length=5),
                                                          supply_year=timezone.datetime(2009, 4, 4))
        self.refrigerator_detail13 = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator13,
                                                                       district=self.district4,
                                                                       available_net_storage_volume=134, temperature=5,
                                                                       required_net_storage_volume=652,
                                                                       functionality_status=FUNCTIONALITY_STATUS[0])

    def test_temperature_reporting_rate_per_district(self):
        """
        Test temperature reporting data per district. Should only return data for single district
        """
        response_data = {
            "heat_graph_data": [
                {
                    "data": [
                        {
                            "submitted_facilities": 2,
                            "total_facilities": 3,
                            "month": 1
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 1,
                            "month": 2
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 3
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 4
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 5
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 6
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 7
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 8
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 9
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 10
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 11
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
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
                            "submitted_facilities": 2,
                            "total_facilities": 3,
                            "month": 1
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 1,
                            "month": 2
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 3
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 4
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 5
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 6
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 7
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 8
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 9
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 10
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 11
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 12
                        }
                    ],
                    "district": "Kampala District"
                },
                {
                    "data": [
                        {
                            "submitted_facilities": 1,
                            "total_facilities": 2,
                            "month": 1
                        },
                        {
                            "submitted_facilities": 2,
                            "total_facilities": 2,
                            "month": 2
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 3
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 4
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 5
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 6
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 7
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 8
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 9
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 10
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 11
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 12
                        }
                    ],
                    "district": "Jinja District"
                },
                {
                    "data": [
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 1
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 2
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 3
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 4
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 5
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 6
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 7
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 8
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 9
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 10
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 11
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 12
                        }
                    ],
                    "district": "Masaka District"
                },
                {
                    "data": [
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 1
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 2
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 3
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 4
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 5
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 6
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 7
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 8
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 9
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 10
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 11
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 12
                        }
                    ],
                    "district": "Mbarara District"
                },
                {
                    "data": [
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 1
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 2
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 3
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 4
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 5
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 6
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 7
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 8
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 9
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 10
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 11
                        },
                        {
                            "submitted_facilities": 0,
                            "total_facilities": 0,
                            "month": 12
                        }
                    ],
                    "district": "Gulu District"
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

    def test_overview_stats(self):
        # test if only facilities that reported are counted
        facilities = ColdChainFacility.objects.filter(Q(refrigeratordetail__year__gte=2019) &
                                                      Q(refrigeratordetail__year__lte=2020) &
                                                      Q(type__name__icontains='District Store')).distinct().count()
        self.assertEqual(facilities, 3)

        url = reverse("overviewstats")
        response_data = {
            "sufficiency_percentage_at_sites": 25,
            "sufficiency_percentage_at_dvs": 67,
            "sufficiency_percentage_at_hfs": 50,
            "optimality_percentage_at_sites": 46,
            "optimality_percentage_at_dvs": 57,
            "optimality_percentage_at_hfs": 33
        }
        kwargs = {"year": 2019}
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)

    def test_capacity_stats(self):
        # todo fix test
        facilities = ColdChainFacility.objects.filter(Q(refrigeratordetail__year__gte=2019) &
                                                      Q(refrigeratordetail__year__lte=2020) &
                                                      Q(type__name__icontains='District Store')).distinct().count()
        self.assertEqual(facilities, 3)

        url = reverse("capacitymetricsstats")
        response_data = {
            "overall_total_available": 0,
            "gap_metrics": {
                "positive_gap_percentage": 0,
                "negative_gap_count": 0,
                "negative_gap_percentage": 0,
                "positive_gap_count": 0,
                "facilities_with_cce": 0
            },
            "required_available_comparison_metrics": [
                {
                    "total_required": 0,
                    "quarter": 1,
                    "total_available": 0,
                    "year": 2019
                },
                {
                    "total_required": 0,
                    "quarter": 2,
                    "total_available": 0,
                    "year": 2019
                },
                {
                    "total_required": 0,
                    "quarter": 3,
                    "total_available": 0,
                    "year": 2019
                },
                {
                    "total_required": 0,
                    "quarter": 4,
                    "total_available": 0,
                    "year": 2019
                }
            ]
        }
        kwargs = {"start_period": 201901, "end_period": 202001, "carelevel": "Public  HCIII"}
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)

    def test_tempheatfreezestats(self):
        # todo fix test
        url = reverse("tempheatfreezestats")
        response_data = [
            {
                "heat_alarm__sum": 11045,
                "cold_alarm__sum": 287,
                "month": 1,
                "year": 2020
            },
            {
                "heat_alarm__sum": 3960,
                "cold_alarm__sum": 306,
                "month": 2,
                "year": 2020
            },
            {
                "heat_alarm__sum": 3424,
                "cold_alarm__sum": 377,
                "month": 3,
                "year": 2020
            },
            {
                "heat_alarm__sum": None,
                "cold_alarm__sum": None,
                "month": 4,
                "year": 2020
            },
            {
                "heat_alarm__sum": None,
                "cold_alarm__sum": None,
                "month": 5,
                "year": 2020
            },
            {
                "heat_alarm__sum": None,
                "cold_alarm__sum": None,
                "month": 6,
                "year": 2020
            },
            {
                "heat_alarm__sum": None,
                "cold_alarm__sum": None,
                "month": 7,
                "year": 2020
            },
            {
                "heat_alarm__sum": None,
                "cold_alarm__sum": None,
                "month": 8,
                "year": 2020
            },
            {
                "heat_alarm__sum": None,
                "cold_alarm__sum": None,
                "month": 9,
                "year": 2020
            },
            {
                "heat_alarm__sum": None,
                "cold_alarm__sum": None,
                "month": 10,
                "year": 2020
            },
            {
                "heat_alarm__sum": None,
                "cold_alarm__sum": None,
                "month": 11,
                "year": 2020
            },
            {
                "heat_alarm__sum": None,
                "cold_alarm__sum": None,
                "month": 12,
                "year": 2020
            }
        ]

        kwargs = {"year": 2020, "region": "Central Region"}
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)

    def test_tempreportmetrics(self):
        # todo fix test
        url = reverse("tempreportmetrics")
        response_data = [
            {
                "heat_alarm_value": 2,
                "freeze_alarm_value": 0,
                "district__name": "Mbarara District"
            },
            {
                "heat_alarm_value": 7,
                "freeze_alarm_value": 0,
                "district__name": "Amuria District"
            },
            {
                "heat_alarm_value": 0,
                "freeze_alarm_value": 0,
                "district__name": "Kumi District"
            }
        ]

        kwargs = {"year": 2020, "region": "Central Region"}
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)

    def test_optimalitymetrics(self):
        # todo fix test
        url = reverse("optimalitymetrics")
        response_data = [
            {
                "optimal": None,
                "total_cce": None,
                "name": "Kitagwenda District",
                "not_optimal": None
            },
            {
                "optimal": None,
                "total_cce": None,
                "name": "Buikwe District",
                "not_optimal": None
            },
            {
                "optimal": None,
                "total_cce": None,
                "name": "Namayingo District",
                "not_optimal": None
            }
        ]

        kwargs = {"start_period": 202001, "end_period": 202101, "region": "Central Region"}
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)

    def test_eligiblefacilitiesmetrics(self):
        # todo fix test
        url = reverse("eligiblefacilitiesmetrics")
        response_data = [
            {
                "total_number_immunizing_facility": 12,
                "total_eligible_facility": 20,
                "cce_coverage_rate": 60,
                "district__name": "Abim District"
            },
            {
                "total_number_immunizing_facility": 18,
                "total_eligible_facility": 50,
                "cce_coverage_rate": 36,
                "district__name": "Adjumani District"
            },
            {
                "total_number_immunizing_facility": 23,
                "total_eligible_facility": 42,
                "cce_coverage_rate": 55,
                "district__name": "Agago District"
            },
        ]

        kwargs = {"start_period": 202001, "end_period": 202101, "region": "Central Region"}
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)

    def test_eligiblefacilitiesstats(self):
        # todo fix test
        url = reverse("eligiblefacilitiesstats")
        response_data = {
            "cce_coverage_pie_chart": {
                "percentage_not_cce_coverage_rate": 71,
                "percentage_cce_coverage_rate": 29
            },
            "total_eligible_facilities": 3111
        }

        kwargs = {"start_period": 202001, "end_period": 202101, "region": "Central Region"}
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)

    def test_functionalitymetrics(self):
        # todo fix test
        url = reverse("functionalitymetrics")
        response_data = [
            {
                "not_working": 12,
                "total_cce": 75,
                "working": 63,
                "district": "Kampala District",
                "needs_repair": 0
            }
        ]

        kwargs = {"start_period": 201901, "end_period": 202001, "region": "Central Region"}
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)

    def test_capacitymetricsstats(self):
        # todo fix test
        url = reverse("capacitymetricsstats")
        response_data = {
            "overall_total_available": 384312,
            "gap_metrics": [
                {
                    "facilities_with_cce": 0,
                    "negative_gap_count": 0,
                    "negative_gap_percentage": 0,
                    "positive_gap_percentage": 0,
                    "year": 2019,
                    "quarter": 1,
                    "positive_gap_count": 0
                },
                {
                    "facilities_with_cce": 0,
                    "negative_gap_count": 0,
                    "negative_gap_percentage": 0,
                    "positive_gap_percentage": 0,
                    "year": 2019,
                    "quarter": 2,
                    "positive_gap_count": 0
                },
                {
                    "facilities_with_cce": 0,
                    "negative_gap_count": 0,
                    "negative_gap_percentage": 0,
                    "positive_gap_percentage": 0,
                    "year": 2019,
                    "quarter": 3,
                    "positive_gap_count": 0
                },
                {
                    "facilities_with_cce": 0,
                    "negative_gap_count": 0,
                    "negative_gap_percentage": 0,
                    "positive_gap_percentage": 0,
                    "year": 2019,
                    "quarter": 4,
                    "positive_gap_count": 0
                },
                {
                    "facilities_with_cce": 3178,
                    "negative_gap_count": 724,
                    "negative_gap_percentage": 14.0,
                    "positive_gap_percentage": 86.0,
                    "year": 2020,
                    "quarter": 1,
                    "positive_gap_count": 4433
                }
            ],
            "required_available_comparison_metrics": [
                {
                    "total_required": 0,
                    "quarter": 1,
                    "total_available": 0,
                    "year": 2019
                },
                {
                    "total_required": 0,
                    "quarter": 2,
                    "total_available": 0,
                    "year": 2019
                },
                {
                    "total_required": 0,
                    "quarter": 3,
                    "total_available": 0,
                    "year": 2019
                },
                {
                    "total_required": 0,
                    "quarter": 4,
                    "total_available": 0,
                    "year": 2019
                },
                {
                    "total_required": 59806,
                    "quarter": 1,
                    "total_available": 384312,
                    "year": 2020
                }
            ]
        }

        kwargs = {"start_period": 201901, "end_period": 202001, "region": "Central Region"}
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)

    def test_capacitymetrics(self):
        # todo fix test
        url = reverse("capacitymetrics")
        response_data = [
            {
                "available_net_storage_volume": 1705,
                "required_net_storage_volume": 209,
                "name": "Abim District",
                "gap": 1496
            },
            {
                "available_net_storage_volume": 2931,
                "required_net_storage_volume": 664,
                "name": "Adjumani District",
                "gap": 2267
            }]

        kwargs = {"start_period": 201901, "end_period": 202001, "region": "Central Region"}
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)

    def test_optimalitystats(self):
        # todo fix test
        url = reverse("optimalitystats")
        response_data = {
            "dvs_sites": 99,
            "hf": 59,
            "dvs": 70,
            "optimal_bar_graph_metrics": [
                {
                    "quarter": 1,
                    "cce_optimal": 3122,
                    "cce_overall_total": 5157,
                    "year": 2020
                },
                {
                    "quarter": 2,
                    "cce_optimal": 0,
                    "cce_overall_total": 0,
                    "year": 2020
                },
                {
                    "quarter": 3,
                    "cce_optimal": 0,
                    "cce_overall_total": 0,
                    "year": 2020
                },
                {
                    "quarter": 4,
                    "cce_optimal": 0,
                    "cce_overall_total": 0,
                    "year": 2020
                }
            ],
            "hf_sites": 100
        }

        kwargs = {"year": 2020, "region": "Central Region"}
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)

