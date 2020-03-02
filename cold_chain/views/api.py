from django.core.serializers.json import Serializer
from django.db.models import Sum, Case, Value, When, Avg, FloatField, IntegerField
from django.db.models.expressions import F, Q, ExpressionWrapper
from rest_framework.response import Response
from rest_framework.views import APIView
from cold_chain.helpers import *
from cold_chain.models import *
from utility import replace_quotes


class ApiParams(Serializer):
    startyear = models.IntegerField(blank=True, default=None)
    startmonth = models.IntegerField(blank=True, default=None)
    endyear = models.IntegerField(blank=True, default=None)
    endmonth = models.IntegerField(blank=True, default=None)
    district = models.CharField(blank=True, default=None)
    vaccine = models.CharField(blank=True, default=None)


class Quarters(APIView):
    def get(self, request):
        quarters = generate_quarters()
        return Response(quarters)


class Districts(APIView):
    def get(self, request):
        districts = ColdChainFacility.objects.all().values('district').distinct().order_by('district')
        return Response(districts)


class FacilityTypes(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        kwargs = {}
        if district and district.lower() != 'national':
            kwargs.update({'district': district})
        facility_types = ColdChainFacility.objects.filter(**kwargs).values('type__group').annotate(count=Count('id'))
        return Response(facility_types)


class CareLevels(APIView):
    def get(self, request):
        carelevels = FacilityType.objects.all().values('group').distinct().order_by('group')
        return Response(carelevels)


class ImmunizingFacilities(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        carelevel = request.query_params.get('carelevel', None)
        startQuarter = request.query_params.get('startQuarter', '201601')
        endQuarter = request.query_params.get('endQuarter', None)

        # Create arguments for filtering
        args = {'quarter__gte': startQuarter}

        if district:
            args.update({'facility__district': district})

        if carelevel:
            args.update({'facility__type__group': carelevel})

        if endQuarter:
            args.update({'quarter__lte': endQuarter})

        summary = ImmunizingFacility.objects.filter(**args) \
            .values(
            'quarter',
            'static',
            'outreach',
            'ficc_storage',
            'facility',
            'facility__district',
            'facility__name',
            'facility__type__group',
            'facility__code')
        return Response(summary)


class DistrictImmunizingFacilities(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        carelevel = request.query_params.get('carelevel', None)
        startQuarter = request.query_params.get('startQuarter', '201601')
        endQuarter = request.query_params.get('endQuarter', None)

        # Create arguments for filtering
        args = {'quarter__gte': startQuarter}

        if district:
            args.update({'facility__district': district})

        if carelevel:
            args.update({'facility__type__group': carelevel})

        if endQuarter:
            args.update({'quarter__lte': endQuarter})

        summary = ImmunizingFacility.objects.filter(**args) \
            .values('facility__district') \
            .annotate(immunizing=(Count(Q(static='True') | Q(outreach='True'))),
                      immunizing_with_fridge=(Count(Q(static='True') & Q(outreach='True') & Q(ficc_storage='False'))),
                      Total_facilities=(Count('facility__code'))) \
            .order_by('facility__district') \
            .values(
            'facility__district',
            'immunizing',
            'Total_facilities',
            'quarter',
            'immunizing_with_fridge'
        )
        return Response(summary)


class Refrigerators(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        carelevel = request.query_params.get('carelevel', None)
        startQuarter = request.query_params.get('startQuarter', '201601')
        endQuarter = request.query_params.get('endQuarter', None)

        # Create arguments for filtering
        args = {'quarter__gte': startQuarter}

        if district:
            args.update({'facility__district': district})

        if carelevel:
            args.update({'facility__type__group': carelevel})

        if endQuarter:
            args.update({'quarter__lte': endQuarter})

        summary = Refrigerator.objects.filter() \
            .values(
            'number_existing',
            'working_well',
            'needs_maintenance',
            'not_working',
            'facility__district',
            'facility__name',
            'quarter')
        return Response(summary)


class DistrictRefrigerators(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        carelevel = request.query_params.get('carelevel', None)
        startQuarter = request.query_params.get('startQuarter', '201602')
        endQuarter = request.query_params.get('endQuarter', None)

        # Create arguments for filtering
        args = {'quarter__gte': startQuarter}

        if district and district.lower() != 'national':
            args.update({'facility__district': district})

        if carelevel:
            args.update({'facility__type__group': carelevel})

        if endQuarter:
            args.update({'quarter__lte': endQuarter})

        summary = Refrigerator.objects.filter(**args) \
            .values('facility__district') \
            .annotate(working_well=Sum('working_well'),
                      needs_maintenance=Sum('needs_maintenance'),
                      not_working=Sum('not_working'),
                      total_facilities=Count('facility__code'),
                      number_existing=Sum('number_existing')) \
            .order_by('-not_working') \
            .values(
            'working_well',
            'needs_maintenance',
            'not_working',
            'quarter',
            'number_existing',
            'total_facilities',
            'facility__district')
        return Response(summary)


class FacilityRefrigerators(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        carelevel = request.query_params.get('carelevel', 'all')
        startQuarter = request.query_params.get('startQuarter', '201601')
        endQuarter = request.query_params.get('endQuarter', None)

        # Create arguments for filtering
        args = {'quarter__gte': startQuarter}

        if district:
            args.update({'facility__district': district})

        if carelevel:
            args.update({'facility__type__group': carelevel})

        if endQuarter:
            args.update({'quarter__lte': endQuarter})

        summary = Refrigerator.objects.filter(**args) \
            .values('facility__name') \
            .annotate(working_well=Sum('working_well'),
                      needs_maintenance=Sum('needs_maintenance'),
                      not_working=Sum('not_working'),
                      number_existing=Sum('number_existing')) \
            .order_by('-not_working') \
            .values(
            'working_well',
            'needs_maintenance',
            'not_working',
            'quarter',
            'number_existing',
            'facility__name')
        return Response(summary)


class Capacities(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        carelevel = request.query_params.get('carelevel', None)
        startQuarter = request.query_params.get('startQuarter', '201601')
        endQuarter = request.query_params.get('endQuarter', None)

        # Create arguments for filtering
        args = {'quarter__gte': startQuarter}

        if district:
            args.update({'facility__district': district})

        if carelevel:
            args.update({'facility__type__group': carelevel})

        if endQuarter:
            args.update({'quarter__lte': endQuarter})

        summary = Capacity.objects.filter(**args) \
            .order_by('facility__district') \
            .values(
            'actual',
            'required',
            'difference',
            'quarter',
            'facility',
            'facility__district',
            'facility__name',
            'facility__type__group')
        return Response(summary)


class DistrictCapacities(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        carelevel = request.query_params.get('carelevel', None)
        startQuarter = request.query_params.get('startQuarter', '201601')
        endQuarter = request.query_params.get('endQuarter', None)

        # Create arguments for filtering
        args = {'quarter__gte': startQuarter}

        if district:
            args.update({'facility__district': district})

        if carelevel:
            args.update({'facility__type__group': carelevel})

        if endQuarter:
            args.update({'quarter__lte': endQuarter})

        summary = Capacity.objects.filter(**args) \
            .values('facility__district') \
            .annotate(required=Sum(F('required')),
                      available=Sum(F('actual')),
                      difference=Sum(F('required') - F('actual')),

                      surplus=Case(
                          When(Q(difference=Value(0)) | Q(required=Value(0)), then=Value(0)),
                          default=(
                              ExpressionWrapper(100 * F('difference') / F('required'), output_field=IntegerField()))
                      )
                      ) \
            .order_by('difference') \
            .values(
            'available',
            'required',
            'difference',
            'surplus',
            'quarter',
            'facility__district')
        return Response(summary)


class FacilityCapacities(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        carelevel = request.query_params.get('carelevel', None)
        startQuarter = request.query_params.get('startQuarter', '201601')
        endQuarter = request.query_params.get('endQuarter', None)

        # Create arguments for filtering
        args = {'quarter__gte': startQuarter}

        if district and district.lower() != "national":
            args.update({'facility__district': district})

        if carelevel:
            args.update({'facility__type__group': carelevel})

        if endQuarter:
            args.update({'quarter__lte': endQuarter})

        summary = Capacity.objects.filter(**args) \
            .values('facility__name') \
            .annotate(required=F('required'),
                      actual=F('actual'),
                      difference=(F('required') - F('actual')),
                      adequate=(F('actual') - F('required')),
                      surplus=Case(
                          When(Q(adequate=Value(0)) | Q(required=Value(0)), then=Value(0)),
                          default=(ExpressionWrapper(100 * F('adequate') / F('required'), output_field=IntegerField()))
                      )) \
            .order_by('-difference') \
            .values(
            'actual',
            'adequate',
            'required',
            'difference',
            'surplus',
            'quarter',
            'facility__name')
        return Response(summary)


class FunctionalityMetrics(APIView):
    def get(self, request):
        district_name = request.query_params.get('district', None)
        facility_type = replace_quotes(request.query_params.get('carelevel', 'all'))
        year = replace_quotes(request.query_params.get('year', '2015'))
        year_half = replace_quotes(request.query_params.get('year_half', '1'))

        summary = []
        total_working = 0
        total_not_working = 0
        total_needs_repair = 0

        districts = District.objects.all()

        for district in districts:
            print(district)
            working = RefrigeratorDetail.objects.filter(Q(district__name__icontains=district) &
                                                        Q(functionality_status__icontains=FUNCTIONALITY_STATUS[0][
                                                            0]) & Q(year=int(year)) & Q(year_half=int(year_half)))
            if facility_type.lower() != 'all':
                working = working.filter(refrigerator__cold_chain_facility__type__name__icontains=facility_type)
            total_working += working.count()

            not_working = RefrigeratorDetail.objects.filter(Q(district__name__icontains=district) &
                                                            Q(functionality_status__icontains=FUNCTIONALITY_STATUS[1][
                                                                0]) & Q(year=int(year)) & Q(year_half=int(year_half)))
            if facility_type.lower() != 'all':
                not_working = not_working.filter(refrigerator__cold_chain_facility__type__name__icontains=facility_type)
            total_not_working += not_working.count()

            needs_repair = RefrigeratorDetail.objects.filter(Q(district__name__icontains=district) &
                                                             Q(functionality_status__icontains=FUNCTIONALITY_STATUS[2][
                                                                 0]) & Q(year=int(year)) & Q(year_half=int(year_half)))
            if facility_type.lower() != 'all':
                needs_repair = needs_repair.filter(
                    refrigerator__cold_chain_facility__type__name__icontains=facility_type)
            total_needs_repair += needs_repair.count()

            summary.append({'district': district.name, 'working': working.count(), 'not_working': not_working.count(),
                            'needs_repair': needs_repair.count()})

        return Response(summary)


class FunctionalityMetricsGraph(APIView):
    def get(self, request):
        district_name = request.query_params.get('district', None)
        facility_type = replace_quotes(request.query_params.get('carelevel', 'all'))
        start_period = replace_quotes(request.query_params.get('start_period', '2019_1'))
        end_period = replace_quotes(request.query_params.get('end_period', '2019_2'))

        start_year, start_half = [int(x) for x in start_period.split('_')]
        end_year, end_half = [int(x) for x in end_period.split('_')]

        functionality_working_total = 0
        functionality_not_working_total = 0
        functionality_needs_repair_total = 0
        summary = []
        statistics = []

        while (start_year <= end_year):
            for year_half in range(1, 3):
                working = RefrigeratorDetail.objects.filter(Q(functionality_status__icontains=FUNCTIONALITY_STATUS[0][
                    0]) & Q(year=start_year))
                working_total, working_per_half = self.add_data_filters(district_name, facility_type, working,
                                                                        year_half)
                print(working_total)
                functionality_working_total += working_total

                not_working = RefrigeratorDetail.objects.filter(
                    Q(functionality_status__icontains=FUNCTIONALITY_STATUS[1][
                        0]) & Q(year=start_year))
                not_working_total, not_working_per_half = self.add_data_filters(district_name, facility_type,
                                                                                not_working, year_half)
                functionality_not_working_total += not_working_total

                needs_repair = RefrigeratorDetail.objects.filter(
                    Q(functionality_status__icontains=FUNCTIONALITY_STATUS[2][
                        0]) & Q(year=start_year))
                needs_repair_total, needs_repair_per_half = self.add_data_filters(district_name, facility_type,
                                                                                  needs_repair, year_half)
                functionality_needs_repair_total += needs_repair_total

                working = working_per_half.count()
                not_working = not_working_per_half.count()
                needs_repair = needs_repair_per_half.count()

                percentages_object = self.generate_percentages(needs_repair, not_working, working, start_year,
                                                               year_half)
                statistics.append(percentages_object)
            start_year = start_year + 1

        functionality_percentage = round((functionality_working_total /
                                          float(functionality_working_total +
                                                functionality_not_working_total +
                                                functionality_needs_repair_total)) * 100, 1)
        statistics.append({'functionality_percentage': functionality_percentage})
        summary.append({'statistics': statistics})
        return Response(statistics)

    def add_data_filters(self, district_name, facility_type, object, year_half):
        if replace_quotes(facility_type) != 'all':
            object = object.filter(refrigerator__cold_chain_facility__type__name__icontains=facility_type)
        if replace_quotes(district_name) != 'national':
            object = object.filter(district__name__icontains=replace_quotes(district_name))
        return object.count(), object.filter(year_half=int(year_half))

    def generate_percentages(self, needs_repair, not_working, working, year, year_half):
        working_percentage = 0
        not_working_percentage = 0
        needs_repair_percentage = 0
        try:
            working_percentage = round((working / float(working + not_working + needs_repair)) * 100, 1)
            not_working_percentage = round((not_working / float(working + not_working + needs_repair)) * 100, 1)
            needs_repair_percentage = round((needs_repair / float(working + not_working + needs_repair)) * 100, 1)
        except ZeroDivisionError as e:
            print(e)
        return {'working_percentage': working_percentage,
                'not_working_percentage': not_working_percentage,
                'needs_repair_percentage': needs_repair_percentage,
                'working': working,
                'not_working': not_working,
                'needs_repair': needs_repair,
                'year': year,
                'year_half': year_half}
