from django.core.serializers.json import Serializer
from django.core import serializers
from django.db.models import Sum, Case, Value, When, Avg, FloatField, IntegerField, Count
from django.db.models.expressions import F, Q, ExpressionWrapper
from rest_framework.response import Response
from rest_framework.views import APIView
from cold_chain.helpers import *
from coverage.models import *
from django.db import connections


class DHIS2VaccineDoses(APIView):
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

        summary = DHIS2VaccineDoseDataset.objects.filter(**args)\
                .values('district__name')\
                .values(
                        'period',
                        'vaccine__name',
                        'dose',
                        'district__name',
                        'consumed',
                        'planned_consumption',

                        )
        return Response(summary)


class AvailableYears(APIView):
    def get(self, request):

        results = VaccineDose.objects.values_list('period', flat=True)\
            .order_by("period")\
            .distinct()

        periods = list(results)
        start_period = str(periods[0])
        end_period = str(periods[-1])

        start_year = start_period[0:4]
        end_year = end_period[0:4]

        return Response({
            'start': {'year': start_year, 'month': start_period[4:]},
            'end': {'year': end_year, 'month': end_period[4:]},
            'years': range(int(start_year), int(end_year)+1)
        })


class VaccineDoses(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        vaccine = request.query_params.get('vaccine', None)
        period = request.query_params.get('period', DHIS2VaccineDoseDataset.objects.all().order_by('period').last().period)

        args = {}

        if district:
            args.update({'district__name': district})

        if vaccine:
            args.update({'vaccine__name': vaccine})

        if period:

            args.update({'period': period})

        summary = VaccineDose.objects.filter(**args) \
            .annotate(consumed=F('last_dose'),
                      Not_immunized=ExpressionWrapper(F('planned_consumption')- F('consumed'), output_field=FloatField()),

                      Red_category = Case(
                                        When(Q(access__gte=90) & Q(drop_out_rate__gte=0) & Q(drop_out_rate__lte=10), then=Value(1)),
                                        When(Q(access__gte=90) & (Q(drop_out_rate__lt=0) | Q(drop_out_rate__gt=10)), then=Value(2)),
                                        When(Q(access__lt=90) & Q(drop_out_rate__gte=0) & Q(drop_out_rate__lte=10), then=Value(3)),
                                        When(Q(access__lt=90) & (Q(drop_out_rate__lt=0) | Q(drop_out_rate__gt=10)), then=Value(4)),
                                        output_field=IntegerField()),

                      )\
            .order_by('vaccine__name')\
            .values(
            'period',
            'vaccine__name',
            'district__name',
            'drop_out_rate',
            'coverage_rate',
            'first_dose',
            'last_dose',
            'consumed',
            'under_immunized',
            'planned_consumption',
            'Not_immunized',
            'access',
            'Red_category',

        )

        return Response(summary)


class VaccineDosesByPeriod(APIView):

    def get_db_last_year(self):
        period = DHIS2VaccineDoseDataset.objects.all().order_by('period').last().period
        year = int(str(period)[0:4])

        return year - 1, year

    def get_ranges_from_years(self, start_year, end_year):
        # Extend end year to cater for Financial year (Upto June)
        end_year = int(end_year) + 1

        start_period = int("%s01" % start_year)
        end_period = int("%s06" % end_year)

        return start_period, end_period

    def get_last_available_period(self, last_period):
        period = DHIS2VaccineDoseDataset.objects\
            .filter(period__lte=last_period)\
            .all().order_by('period').last().period

        return period

    def get(self, request):
        filters = {}

        default_start, default_end = self.get_db_last_year()

        district = request.query_params.get('district', None)
        vaccine = request.query_params.get('vaccine', None)
        start_year = request.query_params.get('startYear', default_start)
        end_year = request.query_params.get('endYear', default_end)
        period = request.query_params.get('period', None)
        data_type = request.query_params.get('dataType', None)
        enable_district_grouping = request.query_params.get('enableDistrictGrouping', None)

        grouping_fields = ['period', 'vaccine__name']

        if district and district.lower() != 'national':
            filters.update({'district__name': district})

        if vaccine and vaccine.lower() != "all":
            if vaccine.strip() == 'DPT':
                vaccine = "PENTA"

            filters.update({'vaccine__name': vaccine})

        #     start_period, end_period = self.get_ranges_from_years(start_year, end_year)
        #     filters.update({'period__gte': start_period, 'period__lte': end_period})
        # else:
        #     start_period, end_period = self.get_ranges_from_years(end_year, end_year)
        #     filters.update({'period__gte': start_period, 'period__lte': end_period})

        start_period, end_period = self.get_ranges_from_years(start_year, end_year)
        filters.update({'period__gte': start_period, 'period__lte': end_period})

        if data_type and data_type == 'map':
            grouping_fields.append('district__name')

            # Get possible last periods
            last_calendar_year_period = self.get_last_available_period(int("%s12" % end_year))

            last_fy_period = int("%s06" % (int(end_year) + 1))
            last_financial_year_period = self.get_last_available_period(last_fy_period)

            start_period = int("%s01" % int(end_year))

            filters.update({'period__gte': start_period, 'period__lte': last_financial_year_period})
            # filters.update({
            #     'period__in': [last_calendar_year_period, last_financial_year_period]
            # })
        elif enable_district_grouping and int(enable_district_grouping) == 1:
            grouping_fields.append('district__name')

        if period is not None:
            start_period = "%s01" % period[0:4]
            filters.update({'period__gte': int(start_period), 'period__lte': int(period)})

        summary = VaccineDose.objects.filter(**filters)\
            .values(*grouping_fields) \
            .annotate(total_actual=Sum('last_dose'),
                      total_last_dose=Sum('last_dose'),
                      total_first_dose=Sum('first_dose'),
                      total_second_dose=Sum('second_dose'),
                      total_third_dose=Sum('third_dose'),
                      total_planned=Sum('planned_consumption')) \
            .order_by('period') \
            .all()

        return Response(summary)


class CoverageAnnualized(APIView):

    def get(self, request):
        district = request.query_params.get('district', None)
        period = request.query_params.get('period', DHIS2VaccineDoseDataset.objects.all().order_by('period').last().period)
        endPeriod = period

        year = int(str(period)[0:4])
        startPeriod = '%s%02d' % (year, 1)

        def dictfetchall(cursor):

         columns = [col[0] for col in cursor.description]
         return [
          dict(zip(columns, row))
          for row in cursor.fetchall()
         ]
        cursor = connections['default'].cursor()

        mysql= """ SELECT
              a.id,
              a.period,
              a.drop_out_rate,
              a.coverage_rate,
              a.first_dose,
              a.last_dose as consumed,
              a.last_dose,
              a.under_immunized,
              a.planned_consumption,
              a.access,
              (a.planned_consumption - a.last_dose) as not_immunized,
              (case
                when (a.access >= 90) and (a.drop_out_rate between 0 and 10) then 1
                when (a.access >= 90) and (a.drop_out_rate < 0) or (a.drop_out_rate > 10) then 2
                when (a.access <= 90) and (a.drop_out_rate between 0 and 10) then 3
                when (a.access <= 90) and (a.drop_out_rate < 0) or (a.drop_out_rate > 10) then 4
               end
              ) as red_category,
              d.name AS district,
              v.name AS vaccine,
              (SELECT
              AVG(x.coverage_rate) as avoc
            FROM
              public.coverage_vaccinedose x,
              public.dashboard_district y,
              public.dashboard_vaccine z
            WHERE
              x.district_id = y.id AND
              x.vaccine_id = z.id AND
              x.period BETWEEN %s AND %s AND
              x.district_id = a.district_id AND
              x.vaccine_id = a.vaccine_id
            GROUP BY
              z.name, y.name
              ) AS avoc
            FROM
              public.coverage_vaccinedose a,
              public.dashboard_district d,
              public.dashboard_vaccine v
            WHERE
              a.vaccine_id = v.id AND
              a.district_id = d.id AND
              a.period = %s"""

        if district:
            myquery = mysql + " AND d.name = '%s'" % district
            cursor.execute(myquery, [startPeriod, endPeriod, period])
        else:
            cursor.execute(mysql, [startPeriod, endPeriod, period])

        result = dictfetchall(cursor)
        return Response(result)


