python manage.py dhis2_00_download_org_units subcounty
python manage.py dhis2_01_download_facilities
python manage.py dhis2_02_set_org_unit_parents region
python manage.py dhis2_02_set_org_unit_parents district
python manage.py dhis2_02_set_org_unit_parents subcounty
python manage.py dumpdata dashboard.region --indent 2 > .\dashboard\fixtures\region.json
python manage.py dumpdata dashboard.district --indent 2 > .\dashboard\fixtures\district.json
python manage.py dumpdata dashboard.subcounty --indent 2 > .\dashboard\fixtures\subcounty.json
python manage.py dumpdata dashboard.facility --indent 2 > .\dashboard\fixtures\facility.json
python manage.py dumpdata --indent 2 > .\dashboard\fixtures\initial_data.json