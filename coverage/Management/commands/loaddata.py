from datetime import date
from django.db import IntegrityError
from dashboard import utils
from dashboard.models import *
from coverage.models import *

def save_from_model(period):
    sql = """SELECT
           row_number() OVER () AS id,
              dashboard_district.name as district,
              dashboard_vaccine.name as vaccine,
              dashboard_dataelement.name as dose,
              dashboard_dhis2dataset.period,
              SUM(dashboard_dhis2dataset.value) as consumed
            FROM
              dashboard_dhis2dataset
            inner join dashboard_dataelement on dashboard_dataelement.identifier = dashboard_dhis2dataset.dataelement
            inner join dashboard_vaccinecategory on dashboard_dataelement.id = dashboard_vaccinecategory.data_element_id
            left join dashboard_district as d on d.identifier = dashboard_dhis2dataset.org_unit
            inner join dashboard_vaccine on dashboard_vaccinecategory.vaccine_id = dashboard_vaccine.id
            inner join dashboard_facility on dashboard_facility.identifier = dashboard_dhis2dataset.org_unit
            inner join dashboard_subcounty on dashboard_subcounty.id = dashboard_facility.sub_county_id
            inner join dashboard_district on dashboard_subcounty.district_id = dashboard_district.id
            where dashboard_vaccine.index > 0 and dashboard_dhis2dataset.period = '%s'
            group by dashboard_district.name, dashboard_vaccine.name, dashboard_dataelement.name, dashboard_dhis2dataset.period;
         """ % period

    dhis2ds = DHIS2Dataset.objects.raw(sql)

    print "Processing data for period %s" % period

    for dh in dhis2ds:
        year = int(str(dh.period)[0:4])
        month = int(str(dh.period)[4:])

        stock_requirement = StockRequirement.objects.filter(
            district__name__contains=dh.district,
            vaccine__name=dh.vaccine,
            year=year,
        ).first()
        try:
            if stock_requirement:
                VaccineDose.objects.update_or_create(
                    vaccine = stock_requirement.vaccine,
                    district = stock_requirement.district,
                    period = dh.period,
                    dose = dh.dose,
                    defaults={'planned_consumption': stock_requirement.target,
                              'consumed': dh.consumed},
                )

                print "%s %s %s : %s - Consumed: %s" % (dh.id, dh.period, dh.district, dh.vaccine, dh.consumed)
        except IntegrityError, e:
            print "| Failing... %s" % e.message

