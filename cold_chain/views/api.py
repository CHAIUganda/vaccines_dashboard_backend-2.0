from django.core.serializers.json import Serializer
from django.db.models import Sum, Case, Value, When, Avg, FloatField, IntegerField
from django.db.models.expressions import F, Q, ExpressionWrapper
from rest_framework.response import Response
from rest_framework.views import APIView
from cold_chain.helpers import *
from cold_chain.models import *
from utility import replace_quotes, quarter_months
from dateutil.relativedelta import relativedelta
import datetime


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


class CareLevels(APIView):
    def get(self, request):
        facility_types = FacilityType.objects.all().values('name')
        return Response(facility_types)


class RequestSuperClass(APIView):
    def get(self, request):
        self.district_name = replace_quotes(request.query_params.get('district', 'national'))
        self.facility_type = replace_quotes(request.query_params.get('carelevel', 'all'))
        self.start_period = replace_quotes(request.query_params.get('start_period', '2019_1'))
        self.end_period = replace_quotes(request.query_params.get('end_period', '2019_2'))

        self.start_year, self.start_half = [int(x) for x in self.start_period.split('_')]
        self.end_year, self.end_half = [int(x) for x in self.end_period.split('_')]

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

                functionality_percentages = self.generate_functionality_percentages(needs_repair, not_working, working, self.start_year,
                                                                             quarter)
                statistics.append(functionality_percentages)
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

    def generate_functionality_percentages(self, needs_repair, not_working, working, year, quarter):
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
        The table data for the available, required and gap
    Procedure:
        Go through the RefrigeratorDetails for each district
        while aggregating the available and required volume then get gap
    """

    def get(self, request):
        super(CapacityMetrics, self).get(request)

        current_district = ''
        summary = []
        total_available_net_storage_volume = 0
        total_required_net_storage_volume = 0

        fridge_details = RefrigeratorDetail.objects.filter(Q(year__gte=self.start_year) & Q(year__lte=self.end_year)) \
            .order_by('district__name')
        for fridge_detail in fridge_details:
            print(fridge_detail)
            try:
                if fridge_detail.district.name != current_district:
                    summary.append({
                        'district': current_district,
                        'available_net_storage_volume': total_available_net_storage_volume,
                        'required_net_storage_volume': total_required_net_storage_volume,
                        'gap': total_available_net_storage_volume - total_required_net_storage_volume
                    })
                    # reset values after making data object for the district
                    current_district = fridge_detail.district.name
                    total_available_net_storage_volume = 0
                    total_required_net_storage_volume = 0
                total_available_net_storage_volume += fridge_detail.available_net_storage_volume
                total_required_net_storage_volume += fridge_detail.required_net_storage_volume
            except Exception as e:
                print(e)
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
        districts_with_cce = []
        current_district = ''

        all_fridges = RefrigeratorDetail.objects.filter(
            Q(year__gte=self.start_year) & Q(year__lte=self.end_year)).exclude(
            district__name__isnull=True).exclude(district__name__exact='').order_by('district')
        districts_with_cce += [fridge.district for fridge in all_fridges]
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

        return {
            'positive_gap_count': positive_gap_count,
            'negative_gap_count': negative_gap_count,
            'districts_with_cce_count': districts_with_cce_count,
            'positive_gap_percentage': round((positive_gap_count / float(districts_with_cce_count)) * 100, 0),
            'negative_gap_percentage': round((negative_gap_count / float(districts_with_cce_count)) * 100, 0)
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
        metrics = EligibleFacilityMetric.objects.filter(Q(year__gte=self.start_year) & Q(year__lte=self.end_year)) \
            .exclude(district__name__isnull=True).exclude(district__name__exact='')

        if self.district_name.lower() != 'national':
            metrics = metrics.filter(district__name__icontains=self.district_name)

        total_eligible_facilities = metrics.count()
        total_archievable_cce_coverage_rate_percentage = total_eligible_facilities * 100

        total_cce_coverage_rate = metrics.aggregate(Sum('cce_coverage_rate'))['cce_coverage_rate__sum']
        percentage_cce_coverage_rate = int(
            round(total_cce_coverage_rate / float(total_archievable_cce_coverage_rate_percentage) * 100, 0))
        percentage_not_cce_coverage_rate = 100 - percentage_cce_coverage_rate

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
        if self.facility_type.lower() != 'all':
            optimal = Sum(Case(When(refrigeratordetail__refrigerator__supply_year__lte=ten_years_ago_date,
                                    refrigeratordetail__year=self.start_year,
                                    refrigeratordetail__refrigerator__cold_chain_facility__type__name__icontains=
                                    self.facility_type.lower(),
                                    then=0),
                               When(refrigeratordetail__refrigerator__supply_year__gte=ten_years_ago_date,
                                    refrigeratordetail__year=self.start_year,
                                    refrigeratordetail__refrigerator__cold_chain_facility__type__name__icontains=
                                    self.facility_type.lower(),
                                    then=1),
                               output_field=IntegerField()))

            not_optimal = Sum(Case(When(refrigeratordetail__refrigerator__supply_year__lte=ten_years_ago_date,
                                        refrigeratordetail__year=self.start_year,
                                        refrigeratordetail__refrigerator__cold_chain_facility__type__name__icontains=self.facility_type.lower(),
                                        then=1),
                                   When(refrigeratordetail__refrigerator__supply_year__gte=ten_years_ago_date,
                                        refrigeratordetail__year=self.start_year,
                                        refrigeratordetail__refrigerator__cold_chain_facility__type__name__icontains=self.facility_type.lower(),
                                        then=0),
                                   output_field=IntegerField()))

            total_cce = Case(When(refrigeratordetail__year=self.start_year,
                                  refrigeratordetail__refrigerator__cold_chain_facility__type__name__icontains=self.facility_type.lower(),
                                  then=Count('refrigeratordetail__refrigerator')),
                             When(~Q(refrigeratordetail__year=self.start_year) &
                                  Q(refrigeratordetail__refrigerator__cold_chain_facility__type__name__icontains=
                                    self.facility_type.lower()),
                                  then=None))

        else:
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

            total_cce = Case(
                When(refrigeratordetail__year=self.start_year, then=Count('refrigeratordetail__refrigerator')),
                When(~Q(refrigeratordetail__year=self.start_year), then=None))

        # make the values distinct since multiple districts will be returned
        summary = District.objects.annotate(optimal=optimal, not_optimal=not_optimal, total_cce=total_cce).distinct()
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

        ten_years_ago_date = datetime.datetime.now() - relativedelta(years=10)
        facility_type = 'District Store'

        dvs, hf, optimality_graph_data = self.get_dvs_and_hf_for_cce_metrics(facility_type, ten_years_ago_date)
        dvs_sites, hf_sites = self.get_dvs_and_hf_for_sites_metrics(facility_type, ten_years_ago_date)

        summary.update({
            "dvs": dvs,
            "dvs_sites": dvs_sites,
            "optimality_graph_data": optimality_graph_data,
            "hf": hf,
            "hf_sites": hf_sites,
        })
        return Response(summary)

    def get_dvs_and_hf_for_cce_metrics(self, facility_type, ten_years_ago_date):
        # gets the percentage based on CCE
        optimal = Sum(Case(When(refrigeratordetail__refrigerator__supply_year__lte=ten_years_ago_date,
                                refrigeratordetail__year=self.start_year,
                                refrigeratordetail__refrigerator__cold_chain_facility__type__name__icontains=facility_type,
                                then=0),
                           When(refrigeratordetail__refrigerator__supply_year__gte=ten_years_ago_date,
                                refrigeratordetail__year=self.start_year,
                                refrigeratordetail__refrigerator__cold_chain_facility__type__name__icontains=facility_type,
                                then=1), output_field=IntegerField()))

        # Returns duplicates districts, each district mapped to a RefrigeratorDetail(Refrigerator)
        # This is used to reduce on the number of queries
        districts = District.objects.filter(
            refrigeratordetail__refrigerator__cold_chain_facility__type__name__icontains=facility_type)

        district_store_cce_overall_total = RefrigeratorDetail.objects.filter(
            Q(refrigerator__cold_chain_facility__type__name__icontains=facility_type)).count()
        districts_store_optimal_cce = districts.aggregate(dvs_optimal=optimal)['dvs_optimal']
        dvs = int(round(districts_store_optimal_cce / float(district_store_cce_overall_total) * 100, 0))

        # health facility metrics
        optimal = Sum(Case(When(refrigeratordetail__refrigerator__supply_year__lte=ten_years_ago_date,
                                refrigeratordetail__year=self.start_year,
                                then=0),
                           When(refrigeratordetail__refrigerator__supply_year__gte=ten_years_ago_date,
                                refrigeratordetail__year=self.start_year,
                                then=1), output_field=IntegerField()))

        districts = District.objects.filter()
        hf_cce_overall_total = RefrigeratorDetail.objects.filter().count()
        hf_optimal_cce = districts.aggregate(hf_optimal=optimal)['hf_optimal']
        hf = int(round(hf_optimal_cce / float(hf_cce_overall_total) * 100, 0))
        ten_years_ago_date = datetime.datetime.now() - relativedelta(years=10)

        optimality_graph_data = dict()

        for quarter in range(1, 5):
            optimal = RefrigeratorDetail.objects.filter(Q(refrigerator__supply_year__gte=ten_years_ago_date)
                                                        & Q(year=self.start_year)
                                                        & Q(district__name__icontains=self.district_name
                                                        if self.district_name != 'national' else '')
                                                        & Q(month__in=quarter_months[quarter])).count()

            not_optimal = RefrigeratorDetail.objects.filter(Q(refrigerator__supply_year__lte=ten_years_ago_date)
                                                            & Q(year=self.start_year)
                                                            & Q(district__name__icontains=self.district_name
                                                            if self.district_name != 'national' else '')
                                                            & Q(month__in=quarter_months[quarter])).count()
            optimality_graph_data.update({
                'quarter ' + str(quarter): {
                    'optimal': optimal,
                    'not_optimal': not_optimal,
                }
            })
        return dvs, hf, optimality_graph_data

    def get_dvs_and_hf_for_sites_metrics(self, facility_type, ten_years_ago_date):
        # gets the percentage based on location where the CCE is kept
        # district vaccine stores metrics
        optimal = Sum(Case(When(refrigerator__supply_year__lte=ten_years_ago_date, then=0),
                           When(refrigerator__supply_year__gte=ten_years_ago_date, then=1),
                           output_field=IntegerField()))
        facilitys = ColdChainFacility.objects.annotate(optimal=optimal).filter(type__name=facility_type) \
            .select_related('district')
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
