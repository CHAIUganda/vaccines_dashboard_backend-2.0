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
                DHIS2VaccineDoseDataset.objects.update_or_create(
                    vaccine = stock_requirement.vaccine,
                    district = stock_requirement.district,
                    period = dh.period,
                    dose = dh.dose,
                    defaults={'planned_consumption': stock_requirement.coverage_target,
                              'consumed': dh.consumed},
                )

                print "%s %s %s : %s - Consumed: %s" % (dh.id, dh.period, dh.district, dh.vaccine, dh.consumed)
        except IntegrityError, e:
            print "| Failing... %s" % e.message


def save_vaccine_dose(period):

    doses = DHIS2VaccineDoseDataset.objects.filter(period=period)
    districts = District.objects.all().order_by('name')

    for d in districts:
        district = d.name
        summary = doses.filter(district=d)

        # ====== OPV ===========================
        opv_drop_out_rate = None
        opv_dose1 = summary.filter(vaccine__name='OPV', dose='105-2.11 Polio 1')
        opv_dose2 = summary.filter(vaccine__name='OPV', dose='105-2.11 Polio 2')
        opv_dose3 = summary.filter(vaccine__name='OPV', dose='105-2.11 Polio 3')
        if opv_dose1 and opv_dose3 and opv_dose1.first().consumed > 0:
            opv_drop_out_rate = float('%.2f' % (((opv_dose1.first().consumed
                                                  - opv_dose3.first().consumed)
                                                 / opv_dose1.first().consumed) * 100))
            VaccineDose.objects.update_or_create(
                vaccine=opv_dose1.first().vaccine,
                district=d,
                period=period,
                drop_out_rate=opv_drop_out_rate,
                under_immunized=opv_dose1.first().consumed-opv_dose3.first().consumed,
                first_dose=opv_dose1.first().consumed,
                second_dose=opv_dose2.first().consumed,
                third_dose=opv_dose3.first().consumed,
                last_dose=opv_dose3.first().consumed,
                access=100*(opv_dose1.first().consumed / opv_dose1.first().planned_consumption),
                coverage_rate=float('%.1f' % (100*(opv_dose3.first().consumed / opv_dose3.first().planned_consumption))),
                planned_consumption=opv_dose3.first().planned_consumption,
            )

        # ====== PCV ===========================
        pcv_drop_out_rate = None
        pcv_dose1 = summary.filter(vaccine__name='PCV', dose='105-2.11 PCV 1')
        pcv_dose2 = summary.filter(vaccine__name='PCV', dose='105-2.11 PCV 2')
        pcv_dose3 = summary.filter(vaccine__name='PCV', dose='105-2.11 PCV 3')
        if pcv_dose1 and pcv_dose3 and pcv_dose1.first().consumed > 0:
            pcv_drop_out_rate = float('%.2f' % (((pcv_dose1.first().consumed
                                                  - pcv_dose3.first().consumed)
                                                 / pcv_dose1.first().consumed) * 100))
            VaccineDose.objects.update_or_create(
                vaccine=pcv_dose1.first().vaccine,
                district=d,
                period=period,
                drop_out_rate=pcv_drop_out_rate,
                under_immunized=pcv_dose1.first().consumed-pcv_dose3.first().consumed,
                first_dose=pcv_dose1.first().consumed,
                second_dose=pcv_dose2.first().consumed,
                third_dose=pcv_dose3.first().consumed,
                last_dose=pcv_dose3.first().consumed,
                access=100 * (pcv_dose1.first().consumed / pcv_dose1.first().planned_consumption),
                coverage_rate=float('%.1f' % (100*(pcv_dose3.first().consumed / pcv_dose3.first().planned_consumption))),
                planned_consumption=pcv_dose3.first().planned_consumption,
            )

        # ====== PENTA ===========================
        penta_drop_out_rate = None
        penta_dose1 = summary.filter(vaccine__name='PENTA', dose='105-2.11 DPT-HepB+Hib 1')
        penta_dose2 = summary.filter(vaccine__name='PENTA', dose='105-2.11 DPT-HepB+Hib 2')
        penta_dose3 = summary.filter(vaccine__name='PENTA', dose='105-2.11 DPT-HepB+Hib 3')
        if penta_dose1 and penta_dose3 and penta_dose1.first().consumed > 0:
            penta_drop_out_rate = float('%.2f' % (((penta_dose1.first().consumed
                                                    - penta_dose3.first().consumed)
                                                   / penta_dose1.first().consumed) * 100))

            VaccineDose.objects.update_or_create(
                vaccine=penta_dose1.first().vaccine,
                district=d,
                period=period,
                drop_out_rate=penta_drop_out_rate,
                under_immunized=penta_dose1.first().consumed-penta_dose3.first().consumed,
                first_dose=penta_dose1.first().consumed,
                second_dose=penta_dose2.first().consumed,
                third_dose=penta_dose3.first().consumed,
                last_dose=penta_dose3.first().consumed,
                access=100 * (penta_dose1.first().consumed / penta_dose1.first().planned_consumption),
                coverage_rate=float('%.1f' % (100*(penta_dose3.first().consumed / penta_dose3.first().planned_consumption))),
                planned_consumption=penta_dose3.first().planned_consumption,
            )

        # ====== TT ===========================
        tt_drop_out_rate = None
        tt_dose1 = summary.filter(vaccine__name='TT', dose='105-2.9 Tetanus Immunization Dose 1')
        tt_dose2 = summary.filter(vaccine__name='TT', dose='105-2.9 Tetanus Immunization Dose 2')
        if tt_dose1 and tt_dose2 and tt_dose1.first().consumed > 0:
            tt_drop_out_rate = float('%.2f' % (((tt_dose1.first().consumed
                                                 - tt_dose2.first().consumed)
                                                / tt_dose1.first().consumed) * 100))
            VaccineDose.objects.update_or_create(
                vaccine=tt_dose1.first().vaccine,
                district=d,
                period=period,
                drop_out_rate=tt_drop_out_rate,
                under_immunized=tt_dose1.first().consumed-tt_dose2.first().consumed,
                first_dose=tt_dose1.first().consumed,
                second_dose=tt_dose2.first().consumed,
                last_dose=tt_dose2.first().consumed,
                access=100 * (tt_dose1.first().consumed / tt_dose1.first().planned_consumption),
                coverage_rate=float('%.1f' % (100*(tt_dose2.first().consumed / tt_dose2.first().planned_consumption))),
                planned_consumption=tt_dose2.first().planned_consumption,
            )

        # ====== HPV ===========================
        hpv_drop_out_rate = None
        hpv_dose1 = summary.filter(vaccine__name='HPV', dose='105-2.10 HPV1-Dose 1')
        hpv_dose2 = summary.filter(vaccine__name='HPV', dose='105-2.10 HPV2-Dose 2')
        if hpv_dose1 and hpv_dose2 and hpv_dose1.first().consumed > 0:
            hpv_drop_out_rate = float('%.2f' % (((hpv_dose1.first().consumed
                                                  - hpv_dose2.first().consumed)
                                                 / hpv_dose1.first().consumed) * 100))
            VaccineDose.objects.update_or_create(
                vaccine=hpv_dose1.first().vaccine,
                district=d,
                period=period,
                drop_out_rate=hpv_drop_out_rate,
                under_immunized=hpv_dose1.first().consumed-hpv_dose2.first().consumed,
                first_dose=hpv_dose1.first().consumed,
                second_dose=hpv_dose2.first().consumed,
                last_dose=hpv_dose2.first().consumed,
                access=100 * (hpv_dose1.first().consumed / hpv_dose1.first().planned_consumption),
                coverage_rate=float('%.1f' % (100*(hpv_dose2.first().consumed / hpv_dose2.first().planned_consumption))),
                planned_consumption=hpv_dose2.first().planned_consumption,
            )

        # ====== IPV ===========================
        ipv_drop_out_rate = None
        ipv_dose1 = summary.filter(vaccine__name='IPV', dose='105-2.11 IPV')
        ipv_dose2 = summary.filter(vaccine__name='IPV', dose='105-2.11 IPV')
        if ipv_dose1 and ipv_dose2 and ipv_dose1.first().consumed > 0:
            ipv_drop_out_rate = float('%.2f' % (((ipv_dose1.first().consumed
                                                  - ipv_dose2.first().consumed)
                                                 / ipv_dose1.first().consumed) * 100))
            VaccineDose.objects.update_or_create(
                vaccine=ipv_dose1.first().vaccine,
                district=d,
                period=period,
                drop_out_rate=ipv_drop_out_rate,
                under_immunized=ipv_dose1.first().consumed - ipv_dose2.first().consumed,
                first_dose=ipv_dose1.first().consumed,
                second_dose=ipv_dose2.first().consumed,
                last_dose=ipv_dose2.first().consumed,
                access=100 * (ipv_dose1.first().consumed / ipv_dose1.first().planned_consumption),
                coverage_rate=float(
                    '%.1f' % (100 * (ipv_dose2.first().consumed / ipv_dose2.first().planned_consumption))),
                planned_consumption=ipv_dose2.first().planned_consumption,
            )



        # ====== MEASLES ===========================
        bcgm_drop_out_rate=None
        bcgm_dose1 = summary.filter(vaccine__name='BCG')
        bcgm_dose2 = summary.filter(vaccine__name='MEASLES')
        if bcgm_dose1 and bcgm_dose2.first().consumed > 0:
            bcgm_drop_out_rate = float('%.2f' % (((bcgm_dose1.first().consumed
                                                   - bcgm_dose2.first().consumed)
                                                  / bcgm_dose1.first().consumed) * 100))

            VaccineDose.objects.update_or_create(
                vaccine=bcgm_dose2.first().vaccine,
                district=d,
                period=period,
                drop_out_rate=bcgm_drop_out_rate,
                under_immunized=bcgm_dose1.first().consumed-bcgm_dose2.first().consumed,
                first_dose=bcgm_dose1.first().consumed,
                last_dose=bcgm_dose2.first().consumed,
                access=100 * (bcgm_dose2.first().consumed / bcgm_dose2.first().planned_consumption),
                coverage_rate=float('%.1f' % (100*(bcgm_dose2.first().consumed / bcgm_dose2.first().planned_consumption))),
                planned_consumption=bcgm_dose2.first().planned_consumption,
            )
        # ====== BCG ===========================
        bcgm_drop_out_rate = None
        bcgm_dose1 = summary.filter(vaccine__name='BCG')
        bcgm_dose2 = summary.filter(vaccine__name='MEASLES')
        if bcgm_dose2 and bcgm_dose1.first().consumed > 0:
            bcgm_drop_out_rate = float('%.2f' % (((bcgm_dose1.first().consumed
                                                   - bcgm_dose2.first().consumed)
                                                  / bcgm_dose1.first().consumed) * 100))


            VaccineDose.objects.update_or_create(
                vaccine=bcgm_dose1.first().vaccine,
                district=d,
                period=period,
                first_dose=bcgm_dose1.first().consumed,
                drop_out_rate=bcgm_drop_out_rate,
                under_immunized=bcgm_dose1.first().consumed-bcgm_dose2.first().consumed,
                last_dose=bcgm_dose1.first().consumed,
                access=100 * (bcgm_dose1.first().consumed / bcgm_dose1.first().planned_consumption),
                coverage_rate=float('%.1f' % (100*(bcgm_dose1.first().consumed / bcgm_dose1.first().planned_consumption))),
                planned_consumption=bcgm_dose1.first().planned_consumption,
            )

