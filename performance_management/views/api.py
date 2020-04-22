from django.core.serializers.json import Serializer
from django.db.models import Sum, Case, Value, When, Avg, FloatField, IntegerField
from django.db.models.expressions import F, Q, ExpressionWrapper
from rest_framework.response import Response
from rest_framework.views import APIView
from cold_chain.models import *
from utility import replace_quotes, quarter_months, month_to_string, generate_percentage
from dateutil.relativedelta import relativedelta
from rest_framework.generics import ListCreateAPIView
from performance_management.serializers import OrganizationsGetSerializer
import datetime
import collections
from decimal import Decimal


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


class ActivityByOrganization(RequestSuperClass):
    def get(self, request):
        super(ActivityByOrganization, self).get(request)
        # divide the activity status count by 6 because there are 6 quarters
        # assume completion is achieved when all 6 quarter objectives have been completed

        organizations = Organization.objects.filter()
        if self.organization:
            organizations = organizations.filter(name=replace_quotes(self.organization))

        if self.funding:
            organizations = organizations.order_by('name').annotate(completed=Count(
                Case(When(activity__activity_status__status=COMPLETION_STATUS[0][0],
                          activity__funding_status=self.funding, then=1),
                     output_field=IntegerField())),
                activity_status_count=Count('activity__activity_status'),
                # completed_percentage=F('completed') / (F('activity_status_count') * Decimal('1.0')) * 100)
                completed_percentage=F('completed') / (6 * Decimal('1.0')) * 100)
        summary = organizations.values('name', 'completed', 'activity__activity_status__quarter',
                                       'activity__activity_status__year',
                                       'completed_percentage',
                                       'activity_status_count')
        return Response(summary)


class ActivityStatusPercentages(RequestSuperClass):
    def get(self, request):
        super(ActivityStatusPercentages, self).get(request)

        summary = dict()
        activity_status_data = Activity.objects.aggregate(
            completed_count=Count(Case(
                When(activity_status__status=COMPLETION_STATUS[0][0], then=1),
                output_field=IntegerField(),
            )),
            not_done_count=Count(Case(
                When(activity_status__status=COMPLETION_STATUS[1][0], then=1),
                output_field=IntegerField(),
            )),
            ongoing_count=Count(Case(
                When(activity_status__status=COMPLETION_STATUS[2][0], then=1),
                output_field=IntegerField(),
            )),
        )

        completed_count = float(activity_status_data['completed_count'])
        not_done_count = float(activity_status_data['not_done_count'])
        ongoing_count = float(activity_status_data['ongoing_count'])

        try:
            percentages = {
                'completed_percentage': round(completed_count / (completed_count + not_done_count + ongoing_count) * 100, 0),
                'not_done_percentage': round(not_done_count / (completed_count + not_done_count + ongoing_count) * 100, 0),
                'ongoing_percentage': round(ongoing_count / (completed_count + not_done_count + ongoing_count) * 100, 0),
            }

            count_data = {
                'completed_count': completed_count, 'not_done_count': not_done_count, 'ongoing_count': ongoing_count
            }

            summary.update({'percentages': percentages})
            summary.update({'count': count_data})
        except ZeroDivisionError as e:
            print(e)
        return Response(summary)


class ActivityFundingStats(RequestSuperClass):
    def get(self, request):
        super(ActivityFundingStats, self).get(request)

        activity_funding_data = Activity.objects.aggregate(
            funded=Count(Case(
                When(funding_status=FUNDING_STATUS[0][0], then=1),
                output_field=IntegerField(),
            )),
            unfunded=Count(Case(
                When(funding_status=FUNDING_STATUS[1][0], then=1),
                output_field=IntegerField(),
            ))
        )

        summary = {
            'funded': activity_funding_data['funded'],
            'unfunded': activity_funding_data['unfunded'],
            'total': activity_funding_data['funded'] + activity_funding_data['unfunded']
        }
        return Response(summary)


class OrganizationsList(ListCreateAPIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationsGetSerializer


class PlannedActivitiesPerQuarterStats(RequestSuperClass):
    def get(self, request):
        super(PlannedActivitiesPerQuarterStats, self).get(request)
        quarter = 0
        summary = []
        self.start_year = 2020

        for x in range(6):
            if x > 3 and quarter > 3:
                self.start_year += 1
                quarter = 0
            quarter += 1

            activity_count = Activity.objects.filter(
                Q(activity_date__date__gte=datetime.datetime(self.start_year, quarter_months[quarter][0], 1)) &
                Q(activity_date__date__lte=datetime.datetime(self.start_year, quarter_months[quarter][2],
                                                             1))).distinct().count()
            summary.append({'quarter': quarter, 'activity_count': activity_count, 'year': self.start_year})
        return Response(summary)


class BudgetAllocationPerRegionStats(RequestSuperClass):
    def get(self, request):
        super(BudgetAllocationPerRegionStats, self).get(request)
        summary = dict()

        if self.funding == 'Unsecured':
            activity_funding_data = Activity.objects.aggregate(
                district_count=Count(Case(
                    When(Q(funding_status=FUNDING_STATUS[1][0]) & Q(level=LEVEL[0][0]), then=1),
                    output_field=IntegerField(),
                )),
                national_count=Count(Case(
                    When(Q(funding_status=FUNDING_STATUS[1][0]) & Q(level=LEVEL[1][0]), then=1),
                    output_field=IntegerField(),
                ))
            )
        else:
            activity_funding_data = Activity.objects.aggregate(
                district_count=Count(Case(
                    When(Q(funding_status=FUNDING_STATUS[0][0]) & Q(level=LEVEL[0][0]), then=1),
                    output_field=IntegerField(),
                )),
                national_count=Count(Case(
                    When(Q(funding_status=FUNDING_STATUS[0][0]) & Q(level=LEVEL[1][0]), then=1),
                    output_field=IntegerField(),
                ))
            )

        district_count = activity_funding_data['district_count']
        national_count = activity_funding_data['national_count']

        try:
            summary = {
                'district_percentage': int(round(district_count / float(district_count + national_count) * 100,0)),
                'national_percentage': int(round(national_count / float(district_count + national_count) * 100, 0))
            }
        except ZeroDivisionError as e:
            print(e)
        return Response(summary)


class ISCFundingStats(RequestSuperClass):
    """
    ISC - Immunization System Component
    """
    def get(self, request):
        super(ISCFundingStats, self).get(request)
        summary = []

        for component in IMMUNIZATION_COMPONENT:
            activity_funding_data = Activity.objects.filter(
                Q(immunization_component=component[1]) &
                Q(activity_date__date__gte=datetime.datetime(self.start_year, quarter_months[self.start_quarter][0], 1)) &
                Q(activity_date__date__lte=datetime.datetime(self.start_year, quarter_months[self.end_quarter][2],
                                                             1))).aggregate(
                isc_secured=Count(Case(
                    When(Q(funding_status=FUNDING_STATUS[0][0]) & Q(immunization_component=component[1]), then=1),
                    output_field=IntegerField(),
                )),
                isc_unsecured=Count(Case(
                    When(Q(funding_status=FUNDING_STATUS[1][0]) & Q(immunization_component=component[1]),
                         then=1),
                    output_field=IntegerField(),
                )),
                activity_cost_ugx=Sum('activity_cost_ugx'),
                activity_cost_usd=Sum('activity_cost_usd'),
            )
            summary.append({
                'component': component[1],
                'secured': activity_funding_data['isc_secured'],
                'unsecured': activity_funding_data['isc_unsecured'],
                'activity_cost_ugx': activity_funding_data['activity_cost_ugx'],
                'activity_cost_usd': activity_funding_data['activity_cost_usd'],
                'total': activity_funding_data['isc_secured'] + activity_funding_data['isc_unsecured']
            })
        return Response(summary)


class ActivityStatusProgressStats(RequestSuperClass):
    def get(self, request):
        super(ActivityStatusProgressStats, self).get(request)
        summary = dict()
        activity_status = ActivityStatus.objects.aggregate(
            completed=Count(Case(
                When(Q(status=COMPLETION_STATUS[0][0]), then=1),
                output_field=IntegerField(),
            )),
            ongoing=Count(Case(
                When(Q(status=COMPLETION_STATUS[2][0]), then=1),
                output_field=IntegerField(),
            )),
            not_done=Count(Case(
                When(Q(status=COMPLETION_STATUS[1][0]), then=1),
                output_field=IntegerField(),
            ))
        )

        completed = activity_status['completed']
        ongoing = activity_status['ongoing']
        not_done = activity_status['not_done']
        total = completed + ongoing + not_done

        try:
            summary = {
                'completed': completed,
                'ongoing': ongoing,
                'not_done': not_done,
                'completed_percentage': generate_percentage(completed, total),
                'ongoing_percentage': generate_percentage(ongoing, total),
                'not_done_percentage': generate_percentage(not_done, total),
            }
        except ZeroDivisionError as e:
            print(e)
        return Response(summary)