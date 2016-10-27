from django.core.serializers.json import Serializer
from django.db.models import Sum, Case, Value, When, Avg, FloatField, IntegerField
from django.db.models.expressions import F, Q, ExpressionWrapper
from rest_framework.response import Response
from rest_framework.views import APIView
from cold_chain.helpers import *
from coverage.models import *
from collections import defaultdict

class VaccineDoses(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        vaccine = request.query_params.get('vaccine', None)
        period = request.query_params.get('period', None)

        args = {}

        if district:
            args.update({'district__name': district})

        if vaccine:
            args.update({'vaccine__name': vaccine})

        if period:
            args.update({'period': period})

        summary = VaccineDose.objects.filter(**args)\
                .values(
                        'period',
                        'vaccine__name',
                        'dose',
                        'district__name',
                        'consumed',
                        'planned_consumption')
        return Response(summary)

class DropOutRate(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        vaccine = request.query_params.get('vaccine', None)
        period = request.query_params.get('period', VaccineDose.objects.all().order_by('period').last().period)

        args = {}
        rate = []

        if district:
            args.update({'district__name': district})

        if vaccine:
            args.update({'vaccine__name': vaccine})

        if period:
            args.update({'period': period})

        districts = District.objects.all().order_by('name')

        for d in districts:
            district = d.name
            summary = VaccineDose.objects.filter(period=period,district=d)

            #====== OPV ===========================
            opv_drop_out_rate = None
            opv_dose1 = summary.filter(vaccine__name='OPV',dose='105-2.11 Polio 1')
            opv_dose3 = summary.filter(vaccine__name='OPV',dose='105-2.11 Polio 3')
            if opv_dose1 and opv_dose3 and opv_dose1.first().consumed > 0:
                opv_drop_out_rate = float('%.2f' % (((opv_dose1.first().consumed
                                                      - opv_dose3.first().consumed)
                                                     / opv_dose1.first().consumed)*100))


            # ====== PCV ===========================
            pcv_drop_out_rate = None
            pcv_dose1 = summary.filter(vaccine__name='PCV', dose='105-2.11 PCV 1')
            pcv_dose3 = summary.filter(vaccine__name='PCV', dose='105-2.11 PCV 3')
            if pcv_dose1 and pcv_dose3 and pcv_dose1.first().consumed > 0:
                pcv_drop_out_rate = float('%.2f' % (((pcv_dose1.first().consumed
                                                      - pcv_dose3.first().consumed)
                                                     / pcv_dose1.first().consumed) * 100))


            # ====== PENTA ===========================
            penta_drop_out_rate = None
            penta_dose1 = summary.filter(vaccine__name='PENTA', dose='105-2.11 DPT-HepB+Hib 1')
            penta_dose3 = summary.filter(vaccine__name='PENTA', dose='105-2.11 DPT-HepB+Hib 3')
            if penta_dose1 and penta_dose3 and penta_dose1.first().consumed > 0:
                penta_drop_out_rate = float('%.2f' % (((penta_dose1.first().consumed
                                                      - penta_dose3.first().consumed)
                                                     / penta_dose1.first().consumed) * 100))



            # ====== TT ===========================
            tt_drop_out_rate = None
            tt_dose1 = summary.filter(vaccine__name='TT', dose='105-2.9 Tetanus Immunization Dose 1')
            tt_dose2 = summary.filter(vaccine__name='TT', dose='105-2.9 Tetanus Immunization Dose 2')
            if tt_dose1 and tt_dose2 and tt_dose1.first().consumed > 0:
                tt_drop_out_rate = float('%.2f' % (((tt_dose1.first().consumed
                                                      - tt_dose2.first().consumed)
                                                     / tt_dose1.first().consumed) * 100))



            # ====== HPV ===========================
            hpv_drop_out_rate = None
            hpv_dose1 = summary.filter(vaccine__name='HPV', dose='105-2.10 HPV1-Dose 1')
            hpv_dose2 = summary.filter(vaccine__name='HPV', dose='105-2.10 HPV2-Dose 2')
            if hpv_dose1 and hpv_dose2 and hpv_dose1.first().consumed > 0:
                hpv_drop_out_rate = float('%.2f' % (((hpv_dose1.first().consumed
                                                      - hpv_dose2.first().consumed)
                                                     / hpv_dose1.first().consumed) * 100))


            # ====== BCG_MEASLES ===========================
            bcgm_drop_out_rate = None
            bcgm_dose1 = summary.filter(vaccine__name='BCG')
            bcgm_dose2 = summary.filter(vaccine__name='MEASLES')
            if bcgm_dose1 and bcgm_dose2 and bcgm_dose1.first().consumed > 0:
                bcgm_drop_out_rate = float('%.2f' % (((bcgm_dose1.first().consumed
                                                      - bcgm_dose2.first().consumed)
                                                     / bcgm_dose1.first().consumed) * 100))



            rate.append({'district': district,
                         'period': period,
                         'OPV_drop_out_rate': opv_drop_out_rate,
                         'PCV_drop_out_rate': pcv_drop_out_rate,
                         'PENTA_drop_out_rate': penta_drop_out_rate,
                         'TT_drop_out_rate': tt_drop_out_rate,
                         'HPV_drop_out_rate': hpv_drop_out_rate,
                         'BCG_MEASLES_drop_out_rate': bcgm_drop_out_rate})

        return Response(rate)