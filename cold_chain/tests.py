from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from cold_chain.models import *
from dashboard.models import Facility
from django.utils.crypto import get_random_string
from django.utils import timezone


class TestTempMonitoring(APITestCase):
    def setUp(self):
        self.district = District.objects.create(name="Kampala District", identifier="kampala")
        self.district2 = District.objects.create(name="Jinja District", identifier="jinja")
        self.district3 = District.objects.create(name="Masaka District", identifier="masaka")
        self.district4 = District.objects.create(name="Mbarara District", identifier="mbarara")
        self.district5 = District.objects.create(name="Gulu District", identifier="gulu")
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
                                                        model="test1", supply_year=timezone.datetime(2019, 4, 4))
        self.refrigerator_detail = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator,
                                                                     district=self.district,
                                                                     available_net_storage_volume=372, temperature=4,
                                                                     required_net_storage_volume=373,
                                                                     functionality_status=FUNCTIONALITY_STATUS[0])

        self.refrigerator2 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility_ds,
                                                         serial_number=get_random_string(length=8), make="SONY",
                                                         model=get_random_string(length=5),
                                                         supply_year=timezone.datetime(2019, 4, 4))
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
                                                         supply_year=timezone.datetime(2019, 4, 4))
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
                                                         supply_year=timezone.datetime(2019, 4, 4))
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
                                                         supply_year=timezone.datetime(2019, 4, 4))
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

        self.refrigerator10 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility9,
                                                          serial_number=get_random_string(length=8), make="SONY",
                                                          model=get_random_string(length=5),
                                                          supply_year=timezone.datetime(2019, 4, 4))
        self.refrigerator_detail10 = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator10,
                                                                       district=self.district4,
                                                                       available_net_storage_volume=791, temperature=5,
                                                                       required_net_storage_volume=778,
                                                                       functionality_status=FUNCTIONALITY_STATUS[0])

        self.refrigerator11 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility8_ds,
                                                          serial_number=get_random_string(length=8), make="SONY",
                                                          model=get_random_string(length=5),
                                                          supply_year=timezone.datetime(2019, 4, 4))
        self.refrigerator_detail11 = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator11,
                                                                       district=self.district4,
                                                                       available_net_storage_volume=791, temperature=5,
                                                                       required_net_storage_volume=778,
                                                                       functionality_status=FUNCTIONALITY_STATUS[0])

        self.refrigerator12 = Refrigerator.objects.create(cold_chain_facility=self.coldchain_facility10,
                                                          serial_number=get_random_string(length=8), make="SONY",
                                                          model=get_random_string(length=5),
                                                          supply_year=timezone.datetime(2019, 4, 4))
        self.refrigerator_detail12 = RefrigeratorDetail.objects.create(refrigerator=self.refrigerator12,
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
            "sufficiency_percentage_at_hfs": 50
        }
        kwargs = {"year": 2019}
        response = self.client.get(url, kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), response_data)
