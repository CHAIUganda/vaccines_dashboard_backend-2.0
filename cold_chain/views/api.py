from django.core.serializers.json import Serializer
from django.db.models import Sum, Case, Value, When, Avg, FloatField, IntegerField
from django.db.models.expressions import F, Q, ExpressionWrapper
from rest_framework.response import Response
from rest_framework.views import APIView
from cold_chain.helpers import *
from cold_chain.models import *
from utility import replace_quotes, quarter_months, month_to_string, generate_percentage
from dateutil.relativedelta import relativedelta
import datetime
import collections
from decimal import Decimal


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


class RequestSuperClass(APIView):
    def get(self, request):
        self.district_name = replace_quotes(request.query_params.get('district', 'national'))
        self.facility_type = replace_quotes(request.query_params.get('carelevel', 'all'))
        self.start_period = replace_quotes(request.query_params.get('start_period', '201901'))
        self.end_period = replace_quotes(request.query_params.get('end_period', '201902'))
        self.year = int(replace_quotes(request.query_params.get('year', '2019')))
        self.organization = request.query_params.get('organization', None)
        self.funding = replace_quotes(request.query_params.get('funding', 'Secured'))

        self.start_year = int(self.start_period[:4])
        self.start_quarter = int(self.start_period[4:])
        self.end_year = int(self.end_period[:4])
        self.end_quarter = int(self.end_period[4:])

    def add_data_filters(self, district_name, facility_type, object, quarter):
        if replace_quotes(facility_type) != 'all':
            object = object.filter(refrigerator__cold_chain_facility__type__name__icontains=facility_type)
        if replace_quotes(district_name) != 'national':
            object = object.filter(district__name__icontains=replace_quotes(district_name))
        return object.count(), object.filter(month__in=quarter_months[quarter])


class FunctionalityMetrics(RequestSuperClass):
    def get(self, request):
        super(FunctionalityMetrics, self).get(request)
        summary = []
        total_working = 0
        total_not_working = 0
        total_needs_repair = 0

        districts = District.objects.all().order_by('name')

        for district in districts:
            working = RefrigeratorDetail.objects.filter(Q(functionality_status__icontains=FUNCTIONALITY_STATUS[0][
                0]) & Q(year__gte=self.start_year) & Q(year__lte=self.end_year) & Q(district=district))
            if self.facility_type.lower() != 'all':
                working = working.filter(refrigerator__cold_chain_facility__type__name__icontains=self.facility_type)
            total_working += working.count()

            not_working = RefrigeratorDetail.objects.filter(Q(functionality_status__icontains=FUNCTIONALITY_STATUS[1][
                0]) & Q(year__gte=self.start_year) & Q(year__lte=self.end_year) & Q(district=district))
            if self.facility_type.lower() != 'all':
                not_working = not_working.filter(
                    refrigerator__cold_chain_facility__type__name__icontains=self.facility_type)
            total_not_working += not_working.count()

            needs_repair = RefrigeratorDetail.objects.filter(Q(functionality_status__icontains=FUNCTIONALITY_STATUS[2][
                0]) & Q(year__gte=self.start_year) & Q(year__lte=self.end_year) & Q(district=district))
            if self.facility_type.lower() != 'all':
                needs_repair = needs_repair.filter(
                    refrigerator__cold_chain_facility__type__name__icontains=self.facility_type)
            total_needs_repair += needs_repair.count()

            summary.append({'district': district.name, 'working': working.count(), 'not_working': not_working.count(),
                            'needs_repair': needs_repair.count(),
                            'total_cce': working.count() + not_working.count() + needs_repair.count()})

        return Response(summary)


class FunctionalityMetricsGraph(RequestSuperClass):
    def get(self, request):
        super(FunctionalityMetricsGraph, self).get(request)
        functionality_working_total = 0
        functionality_not_working_total = 0
        functionality_needs_repair_total = 0
        statistics = []

        while (self.start_year <= self.end_year):
            for quarter in range(1, 5):
                working = RefrigeratorDetail.objects.filter(Q(functionality_status__icontains=FUNCTIONALITY_STATUS[0][
                    0]) & Q(year=self.start_year))
                working_total, working_per_half = self.add_data_filters(self.district_name, self.facility_type, working,
                                                                        quarter)
                print(working_total)
                functionality_working_total += working_total

                not_working = RefrigeratorDetail.objects.filter(
                    Q(functionality_status__icontains=FUNCTIONALITY_STATUS[1][
                        0]) & Q(year=self.start_year))
                not_working_total, not_working_per_half = self.add_data_filters(self.district_name, self.facility_type,
                                                                                not_working, quarter)
                functionality_not_working_total += not_working_total

                needs_repair = RefrigeratorDetail.objects.filter(
                    Q(functionality_status__icontains=FUNCTIONALITY_STATUS[2][
                        0]) & Q(year=self.start_year))
                needs_repair_total, needs_repair_per_half = self.add_data_filters(self.district_name,
                                                                                  self.facility_type,
                                                                                  needs_repair, quarter)
                functionality_needs_repair_total += needs_repair_total

                working = working_per_half.count()
                not_working = not_working_per_half.count()
                needs_repair = needs_repair_per_half.count()

                percentages_object = self.generate_percentages(needs_repair, not_working, working, self.start_year,
                                                               quarter)
                statistics.append(percentages_object)
            self.start_year = self.start_year + 1
        try:
            functionality_percentage = round((functionality_working_total /
                                              float(functionality_working_total +
                                                    functionality_not_working_total +
                                                    functionality_needs_repair_total)) * 100, 1)
            statistics.append({'functionality_percentage': functionality_percentage})
        except ZeroDivisionError as e:
            print(e)
        return Response(statistics)

    def generate_percentages(self, needs_repair, not_working, working, year, quarter):
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
                'quarter': quarter}


class CapacityMetrics(RequestSuperClass):
    """
    Returns:
        The table data for the available, required and gap for CCE capacity
    """

    def get(self, request):
        super(CapacityMetrics, self).get(request)

        summary = District.objects.filter(Q(refrigeratordetail__year__gte=self.start_year) &
                                          Q(refrigeratordetail__year__lte=self.end_year)).order_by('name') \
            .annotate(available_net_storage_volume=Sum('refrigeratordetail__available_net_storage_volume'),
                      required_net_storage_volume=Sum('refrigeratordetail__required_net_storage_volume'),
                      gap=F('available_net_storage_volume') - F('required_net_storage_volume')) \
            .values('available_net_storage_volume', 'required_net_storage_volume', 'gap', 'name')
        return Response(summary)


class CapacityMetricsStats(RequestSuperClass):
    """
    Returns:
        The statistics data for the total number of liters, positive gap, negative gap, required and gap
    Procedure:
        Go through the RefrigeratorDetails for each district
        while aggregating the available and required volume then calculate the gap
    """

    def get(self, request):
        super(CapacityMetricsStats, self).get(request)
        statistics = []
        overall_total_available = 0
        iterator_year = self.start_year
        summary = dict()

        while (iterator_year <= self.end_year):
            for quarter in range(1, 5):
                all_fridges = RefrigeratorDetail.objects.filter(Q(year=iterator_year)).exclude(
                    district__name__isnull=True).exclude(district__name__exact='').order_by('district')
                all_fridges, all_fridges_per_half = self.add_data_filters(self.district_name, self.facility_type,
                                                                          all_fridges, quarter)

                total_available_list = [x.available_net_storage_volume for x in all_fridges_per_half]
                overall_total_available += sum(filter(lambda v: v is not None, total_available_list))

                total_available_list = [x.available_net_storage_volume for x in all_fridges_per_half]
                total_required_list = [x.required_net_storage_volume for x in all_fridges_per_half]
                total_available = sum(filter(lambda v: v is not None, total_available_list))
                total_required = sum(filter(lambda v: v is not None, total_required_list))

                statistics.append({'total_available': total_available,
                                   'total_required': total_required,
                                   'quarter': quarter,
                                   'year': iterator_year})
            iterator_year = iterator_year + 1
        summary.update({'required_available_comparison_metrics': statistics})
        summary.update({'overall_total_available': overall_total_available})
        summary.update({'gap_metrics': self.generate_gap_data()})
        return Response(summary)

    def generate_gap_data(self):
        positive_gap_count = 0
        negative_gap_count = 0
        total_available_net_storage_volume = 0
        total_required_net_storage_volume = 0
        positive_gap_percentage = 0
        negative_gap_percentage = 0
        districts_with_cce = []
        facilities_with_cce = []
        current_district = ''

        all_fridges = RefrigeratorDetail.objects.filter(
            Q(year__gte=self.start_year) & Q(year__lte=self.end_year)).exclude(
            district__name__isnull=True).exclude(district__name__exact='').order_by('district')

        if self.district_name != 'national':
            all_fridges = all_fridges.filter(district__name=self.district_name)

        districts_with_cce += [fridge.district for fridge in all_fridges]
        facilities_with_cce += [fridge.refrigerator.cold_chain_facility for fridge in all_fridges]
        for fridge_detail in all_fridges:

            if fridge_detail.district.name != current_district:
                gap = total_available_net_storage_volume - total_required_net_storage_volume

                if gap > 0:
                    positive_gap_count += 1
                else:
                    negative_gap_count += 1

                # reset values after making data object for the district
                current_district = fridge_detail.district.name
                total_available_net_storage_volume = 0
                total_required_net_storage_volume = 0
            total_available_net_storage_volume += fridge_detail.available_net_storage_volume
            total_required_net_storage_volume += fridge_detail.required_net_storage_volume
        districts_with_cce_count = len(set(districts_with_cce))
        facilities_with_cce = len(set(facilities_with_cce))

        try:
            positive_gap_percentage = round((positive_gap_count / float(districts_with_cce_count)) * 100, 0)
            negative_gap_percentage = round((negative_gap_count / float(districts_with_cce_count)) * 100, 0)
        except (TypeError, ZeroDivisionError) as e:
            print(e)

        return {
            'positive_gap_count': positive_gap_count,
            'negative_gap_count': negative_gap_count,
            'facilities_with_cce': facilities_with_cce,
            'positive_gap_percentage': positive_gap_percentage,
            'negative_gap_percentage': negative_gap_percentage
        }


class EligibleFacilityMetrics(RequestSuperClass):
    """
    Returns:
        The table data for the eligible facilities, immunizing facilities and cce coverage rate
    Procedure:
        Query the EligibleFacilityMetric filtering by year
    """

    def get(self, request):
        super(EligibleFacilityMetrics, self).get(request)

        metrics = EligibleFacilityMetric.objects.filter(Q(year__gte=self.start_year) & Q(year__lte=self.end_year)) \
            .exclude(district__name__isnull=True).exclude(district__name__exact='') \
            .values('district__name', 'total_eligible_facility', 'total_number_immunizing_facility',
                    'cce_coverage_rate')

        return Response(metrics)


class EligibleFacilityStats(RequestSuperClass):
    def get(self, request):
        super(EligibleFacilityStats, self).get(request)
        summary = dict()
        percentage_cce_coverage_rate = 0
        percentage_not_cce_coverage_rate = 0
        # todo change to date filter
        metrics = EligibleFacilityMetric.objects.filter(Q(year__gte=self.start_year) & Q(year__lte=self.end_year)) \
            .exclude(district__name__isnull=True).exclude(district__name__exact='')

        if self.district_name.lower() != 'national':
            metrics = metrics.filter(district__name__icontains=self.district_name)

        total_eligible_facilities = metrics.aggregate(Sum('total_eligible_facility'))['total_eligible_facility__sum']
        total_number_immunizing_facility = metrics.aggregate(Sum('total_number_immunizing_facility'))['total_number_immunizing_facility__sum']

        try:
            percentage_cce_coverage_rate = generate_percentage(total_number_immunizing_facility, total_eligible_facilities)
            percentage_not_cce_coverage_rate = 100 - percentage_cce_coverage_rate
        except (TypeError, ZeroDivisionError) as e:
            print(e)

        summary.update({'cce_coverage_pie_chart': {
            'percentage_cce_coverage_rate': percentage_cce_coverage_rate,
            'percentage_not_cce_coverage_rate': percentage_not_cce_coverage_rate},
            'total_eligible_facilities': total_eligible_facilities
        })

        return Response(summary)


class OptimalityMetric(RequestSuperClass):
    def get(self, request):
        super(OptimalityMetric, self).get(request)
        # Optimality Metric uses only one year(start_year)

        ten_years_ago_date = datetime.datetime.now() - relativedelta(years=10)

        optimal = Sum(Case(When(refrigeratordetail__refrigerator__supply_year__lte=ten_years_ago_date,
                                refrigeratordetail__year=self.start_year, then=0),
                           When(refrigeratordetail__refrigerator__supply_year__gte=ten_years_ago_date,
                                refrigeratordetail__year=self.start_year, then=1),
                           output_field=IntegerField()))

        not_optimal = Sum(Case(When(refrigeratordetail__refrigerator__supply_year__lte=ten_years_ago_date,
                                    refrigeratordetail__year=self.start_year, then=1),
                               When(refrigeratordetail__refrigerator__supply_year__gte=ten_years_ago_date,
                                    refrigeratordetail__year=self.start_year, then=0),
                               output_field=IntegerField()))

        total_cce = Case(When(refrigeratordetail__year=self.start_year, then=Count('refrigeratordetail__refrigerator')),
                         When(~Q(refrigeratordetail__year=self.start_year), then=None))

        summary = District.objects.annotate(optimal=optimal, not_optimal=not_optimal, total_cce=total_cce)

        if self.facility_type.lower() != 'all':
            summary = summary.filter(
                refrigeratordetail__refrigerator__cold_chain_facility__type__name=self.facility_type)
        return Response(summary.values('name', 'optimal', 'not_optimal', 'total_cce'))


class OptimalityStats(RequestSuperClass):
    """
    Abbreviations
    DVS - District Vaccine Store
    HF - Health Facility
    CCE - Cold Chain Equipment
    """

    def get(self, request):
        super(OptimalityStats, self).get(request)
        summary = dict()

        ten_years_ago_date = datetime.datetime(self.year, 1, 1) - relativedelta(years=10)
        facility_type = 'District Store'

        dvs, hf, optimal_bar_graph_metrics = self.get_dvs_and_hf_for_cce_metrics(facility_type, ten_years_ago_date)
        dvs_sites, hf_sites = self.get_dvs_and_hf_for_sites_metrics(facility_type, ten_years_ago_date)

        summary.update({
            "dvs": dvs,
            "dvs_sites": dvs_sites,
            "optimal_bar_graph_metrics": optimal_bar_graph_metrics,
            "hf": hf,
            "hf_sites": hf_sites,
        })
        return Response(summary)

    def get_dvs_and_hf_for_cce_metrics(self, facility_type, ten_years_ago_date):
        # gets the percentage based on CCE
        # district vaccine stores metrics
        optimal_bar_graph_metrics = []
        dvs = 0
        hf = 0
        optimal = Sum(Case(When(refrigeratordetail__refrigerator__supply_year__lte=ten_years_ago_date,
                                refrigeratordetail__year=self.year,
                                refrigeratordetail__refrigerator__cold_chain_facility__type__name__icontains=facility_type,
                                then=0),
                           When(refrigeratordetail__refrigerator__supply_year__gte=ten_years_ago_date,
                                refrigeratordetail__year=self.year,
                                refrigeratordetail__refrigerator__cold_chain_facility__type__name__icontains=facility_type,
                                then=1), output_field=IntegerField()))

        # Returns duplicates districts, each district mapped to a RefrigeratorDetail(Refrigerator)
        # This is used to reduce on the number of queries
        districts = District.objects.filter(
            refrigeratordetail__refrigerator__cold_chain_facility__type__name__icontains=facility_type)

        district_store_cce_overall_total = RefrigeratorDetail.objects.filter(
            Q(refrigerator__cold_chain_facility__type__name__icontains=facility_type)).count()
        districts_store_optimal_cce = districts.aggregate(dvs_optimal=optimal)['dvs_optimal']
        try:
            dvs = int(round(districts_store_optimal_cce / float(district_store_cce_overall_total) * 100, 0))
        except (TypeError, ZeroDivisionError) as e:
            print(e)

        # health facility metrics
        optimal = Sum(Case(When(refrigeratordetail__refrigerator__supply_year__lte=ten_years_ago_date,
                                refrigeratordetail__year=self.year,
                                then=0),
                           When(refrigeratordetail__refrigerator__supply_year__gte=ten_years_ago_date,
                                refrigeratordetail__year=self.year,
                                then=1), output_field=IntegerField()))

        not_optimal = Sum(Case(When(refrigeratordetail__refrigerator__supply_year__lte=ten_years_ago_date,
                                    refrigeratordetail__year=self.year,
                                    then=1),
                               When(refrigeratordetail__refrigerator__supply_year__gte=ten_years_ago_date,
                                    refrigeratordetail__year=self.year,
                                    then=0), output_field=IntegerField()))

        districts = District.objects.filter()
        hf_cce_overall_total = RefrigeratorDetail.objects.filter().count()
        hf_optimal_cce = districts.aggregate(hf_optimal=optimal)['hf_optimal']
        try:
            hf = int(round(hf_optimal_cce / float(hf_cce_overall_total) * 100, 0))
        except (TypeError, ZeroDivisionError) as e:
            print(e)

        for quarter in quarter_months:
            data = districts.filter(refrigeratordetail__month__in=quarter_months[quarter]).aggregate(
                dvs_optimal=optimal, dvs_not_optimal=not_optimal)

            cce_overall_total = 0
            cce_optimal = 0

            if data:
                cce_overall_total = data['dvs_optimal'] if data['dvs_optimal'] else 0 + data['dvs_not_optimal'] \
                    if data['dvs_not_optimal'] else 0
                cce_optimal = data['dvs_optimal'] if data['dvs_optimal'] else 0

            optimal_bar_graph_metrics.append({
                'quarter': quarter,
                'year': self.year,
                'cce_overall_total': cce_overall_total,
                'cce_optimal': cce_optimal
            })
        return dvs, hf, optimal_bar_graph_metrics

    def get_dvs_and_hf_for_sites_metrics(self, facility_type, ten_years_ago_date):
        # gets the percentage based on location where the CCE is kept
        # district vaccine stores metrics
        optimal_bar_graph_metrics = dict()

        optimal = Sum(Case(When(refrigerator__supply_year__lte=ten_years_ago_date, then=0),
                           When(refrigerator__supply_year__gte=ten_years_ago_date, then=1),
                           output_field=IntegerField()))
        facilitys = ColdChainFacility.objects.annotate(optimal=optimal).filter(type__name=facility_type).select_related(
            'district')
        optimal_facilitys = facilitys.filter(optimal__gt=0)

        districts = [facility.district for facility in facilitys]
        optimal_districts = [facility.district for facility in optimal_facilitys]

        total_districts_count = len(set(filter(lambda v: v is not None, districts)))
        optimal_districts_count = len(set(filter(lambda v: v is not None, optimal_districts)))
        dvs_sites = int(round(optimal_districts_count / float(total_districts_count) * 100, 0))

        # health facility metrics
        facilitys = ColdChainFacility.objects.annotate(optimal=optimal).select_related('district')
        optimal_facilitys = facilitys.filter(optimal__gt=0)

        districts = [facility.district for facility in facilitys]
        optimal_districts = [facility.district for facility in optimal_facilitys]

        total_districts_count = len(set(filter(lambda v: v is not None, districts)))
        optimal_districts_count = len(set(filter(lambda v: v is not None, optimal_districts)))
        hf_sites = int(round(optimal_districts_count / float(total_districts_count) * 100, 0))
        return dvs_sites, hf_sites


class TempReportMetrics(RequestSuperClass):
    """
    Returns temperature reports of freeze and heat alarms for each district
    """

    def get(self, request):
        super(TempReportMetrics, self).get(request)
        temp_reports = TempReport.objects.filter(Q(year=self.year)) \
            .annotate(heat_alarm_value=Sum('heat_alarm'), freeze_alarm_value=Sum('cold_alarm')) \
            .select_related('district').values('district__name', 'heat_alarm_value', 'freeze_alarm_value')
        return Response(temp_reports)


class TempHeatAndFreezeStats(RequestSuperClass):
    """
    Returns freeze and heat alarm totals for the graph
    """

    def get(self, request):
        super(TempHeatAndFreezeStats, self).get(request)
        summary = []

        for month in range(1, 13):
            temp_reports = TempReport.objects.filter(Q(month=month) & Q(year=self.year)).order_by('district') \
                .select_related('district')
            if self.district_name != 'national':
                temp_reports = temp_reports.filter(Q(district__name__icontains=self.district_name))
            temp_reports = temp_reports.aggregate(Sum('heat_alarm'), Sum('cold_alarm'))
            temp_reports.update({
                'month': month,
                'year': self.year,
            })
            summary.append(temp_reports)
        return Response(summary)


class TempReportingRateStats(RequestSuperClass):
    """
    Returns submission percentages and submissions entry data for the TempReport Reporting Rate graphs
    """

    def get(self, request):
        super(TempReportingRateStats, self).get(request)
        summary = dict()
        monthly_submission_data = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
                                   7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0}
        monthly_submission_data_percentages = dict()

        districts = District.objects.all()
        districts_total = districts.count()
        heat_graph_data = []
        submission_percentages_graph_data = []

        for district in districts:
            data = self.generate_montly_submission_data(district, monthly_submission_data)
            heat_graph_data.append({'district': district.name, 'data': data})

        if self.district_name != 'national':
            # reset the data when filtering for one district
            monthly_submission_data = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
                                       7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0}
            district = District.objects.filter(name__icontains=self.district_name).first()
            if district:
                data = self.generate_montly_submission_data(district, monthly_submission_data)
                heat_graph_data.append({'district': district.name, 'data': data})

            for month in range(1, 13):
                monthly_submission_data_percentages[month] = int(
                    round(monthly_submission_data[month] / 1.0 * 100, 0))
        else:
            for month in range(1, 13):
                monthly_submission_data_percentages[month] = int(
                    round(monthly_submission_data[month] / float(districts_total) * 100))
        submission_percentages_graph_data.append({
            'submissions_percentages': monthly_submission_data_percentages,
            'monthly_submissions': monthly_submission_data,
        })

        summary.update({'heat_graph_data': heat_graph_data})
        summary.update({'submission_percentages_graph_data': submission_percentages_graph_data})
        return Response(summary)

    def generate_montly_submission_data(self, district, monthly_submission_data):
        data = []
        temp_reports = TempReport.objects.filter(Q(district=district) & Q(year=self.year))
        if temp_reports:
            report_months = [temp_report.month for temp_report in temp_reports]
            for month in range(1, 13):
                submitted = month in report_months
                data.append({'month': month, 'submitted': submitted})
                if submitted:
                    monthly_submission_data[month] = monthly_submission_data[month] + 1
        return data