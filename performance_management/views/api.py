from django.core.serializers.json import Serializer
from django.db.models import Sum, Case, Value, When, Avg, FloatField, IntegerField, Count
from django.db.models.expressions import F, Q, ExpressionWrapper
from rest_framework.response import Response
from rest_framework.views import APIView
from performance_management.models import *
from utility import replace_quotes, quarter_months, month_to_string, generate_percentage
from dateutil.relativedelta import relativedelta
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from performance_management.serializers import OrganizationsGetSerializer, ImmunizationComponentGetSerializer, \
    ActivityGetSerializer, ActivityStatusGetSerializer
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
        self.organization = replace_quotes(request.query_params.get('organization', 'All'))
        self.isc = replace_quotes(request.query_params.get('isc', 'All'))

        self.start_year = int(self.start_period[:4])
        self.start_quarter = int(self.start_period[4:])
        self.end_year = int(self.end_period[:4])
        self.end_quarter = int(self.end_period[4:])
        self.start_date = datetime.datetime(self.start_year, quarter_months[self.start_quarter][0], 1)
        self.end_date = datetime.datetime(self.end_year, quarter_months[self.end_quarter][2], 1)
        self.activity_status = replace_quotes(request.query_params.get('activity_status', 'Completed'))


class ActivityByOrganization(RequestSuperClass):
    def get(self, request):
        super(ActivityByOrganization, self).get(request)
        summary = []
        args = {}

        if self.organization != 'All':
            args.update({'name': self.organization})

        organizations = Organization.objects.filter(**args)

        for organization in organizations:
            completed = 0
            ongoing = 0
            not_done = 0
            partially_done = 0
            activities_count = 0

            activities = organization.activity_set.all()
            activities = activities.filter(
                Q(activity_date__date__gte=self.start_date) &
                Q(activity_date__date__lte=self.end_date)).distinct()

            for activity in activities:
                if self.isc != 'All':
                    # skip activities without this immunization component
                    if activity.immunization_component.name != self.isc:
                        continue
                # for an activity to be completed or not_done all quarter must be completed or not_done
                # partially_done happens when an activity is over due however, it has atleast one completed activity
                activity_statuses = activity.activity_status.all()
                activity_statuses_count = activity_statuses.count()
                completed_count = activity_statuses.filter(status=COMPLETION_STATUS[0][0]).count()
                not_done_count = activity_statuses.filter(status=COMPLETION_STATUS[1][0]).count()
                activity.activity_date.last()

                if completed_count == activity_statuses_count:
                    completed += 1
                elif not_done_count == activity_statuses_count:
                    not_done += 1
                elif activity.activity_date.order_by(
                        'date').last().date < datetime.datetime.now().date() and completed_count > 1:
                    partially_done += 1
                else:
                    ongoing += 1
                activities_count += 1

            # don't include organizations without activities
            if activities_count == 0:
                continue

            summary.append({
                'organization': organization.name,
                'completed': completed,
                'not_done': not_done,
                'partially_done': partially_done,
                'ongoing': ongoing,
                'activity_count': activities_count,
            })
        return Response(summary)


class ActivityStatusPercentages(RequestSuperClass):
    def get(self, request):
        super(ActivityStatusPercentages, self).get(request)

        summary = dict()
        args = {}
        completed = 0
        ongoing = 0
        not_done = 0
        partially_done = 0
        activities_count = 0

        if self.organization != 'All':
            args.update({'name': self.organization})

        organizations = Organization.objects.filter(**args)

        for organization in organizations:
            activities = organization.activity_set.all()
            activities = activities.filter(
                Q(activity_date__date__gte=self.start_date) &
                Q(activity_date__date__lte=self.end_date)).distinct()

            for activity in activities:
                if self.isc != 'All':
                    # skip activities without this immunization component
                    if activity.immunization_component.name != self.isc:
                        continue
                # for an activity to be completed or not_done all quarter must be completed or not_done
                # partially_done happens when an activity is over due however, it has atleast one completed activity
                activity_statuses = activity.activity_status.all()
                activity_statuses_count = activity_statuses.count()
                completed_count = activity_statuses.filter(status=COMPLETION_STATUS[0][0]).count()
                not_done_count = activity_statuses.filter(status=COMPLETION_STATUS[1][0]).count()
                activity.activity_date.last()

                if completed_count == activity_statuses_count:
                    completed += 1
                elif not_done_count == activity_statuses_count:
                    not_done += 1
                elif activity.activity_date.order_by(
                        'date').last().date < datetime.datetime.now().date() and completed_count > 1:
                    partially_done += 1
                else:
                    ongoing += 1
                activities_count += 1

        try:
            total = completed + not_done + ongoing
            percentages = {
                'completed_percentage': generate_percentage(completed, total),
                'not_done_percentage': generate_percentage(not_done, total),
                'ongoing_percentage': generate_percentage(ongoing, total),
                'partially_done_percentage': generate_percentage(partially_done, total),
            }

            count_data = {
                'completed_count': completed,
                'not_done_count': not_done,
                'ongoing_count': ongoing,
                'partially_done': partially_done
            }

            summary.update({'percentages': percentages})
            summary.update({'count': count_data})
        except ZeroDivisionError as e:
            print(e)
        return Response(summary)


class ActivityFundingStats(RequestSuperClass):
    def get(self, request):
        super(ActivityFundingStats, self).get(request)
        args = {}

        if self.organization != 'All':
            args.update({'organization__name': self.organization})

        if self.isc != 'All':
            print(self.isc)
            print(ImmunizationComponent.objects.filter(name__icontains=self.isc))
            args.update({'immunization_component__name__icontains': self.isc})

        args.update({
            'activity_status__firstdate__gte': self.start_date,
            'activity_status__firstdate__lte': self.end_date,
            'funding_status': FUNDING_STATUS[0][0]
        })

        funded = Activity.objects.filter(**args).distinct().count()
        args.update({'funding_status': FUNDING_STATUS[1][0]})
        unfunded = Activity.objects.filter(**args).distinct().count()

        summary = {
            'funded': funded,
            'unfunded': unfunded,
            'total': funded + unfunded
        }
        return Response(summary)


class OrganizationsList(ListCreateAPIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationsGetSerializer


class ImmunizationComponentList(ListCreateAPIView):
    queryset = ImmunizationComponent.objects.all()
    serializer_class = ImmunizationComponentGetSerializer


class PlannedActivitiesPerQuarterStats(RequestSuperClass):
    def get(self, request):
        super(PlannedActivitiesPerQuarterStats, self).get(request)
        quarter = 0
        summary = []
        args = {}

        if self.organization != 'All':
            args.update({'name': self.organization})
        organizations = Organization.objects.filter(**args)

        for x in range(6):
            if x > 3 and quarter > 3:
                self.start_year += 1
                quarter = 0
            quarter += 1

            for organization in organizations:
                completed = 0
                ongoing = 0
                not_done = 0
                partially_done = 0

                activities = organization.activity_set.all()
                print(activities.count())
                activities = activities.filter(
                    Q(activity_date__date__gte=datetime.datetime(self.start_year, quarter_months[quarter][0], 1)) &
                    Q(activity_date__date__lte=datetime.datetime(self.start_year, quarter_months[quarter][2],
                                                                 1))).distinct()

                activities_count = activities.count()
                print(activities_count)

                for activity in activities:
                    activity_statuses = activity.activity_status.all()
                    activity_statuses_count = activity_statuses.count()
                    completed_count = activity_statuses.filter(status=COMPLETION_STATUS[0][0]).count()
                    not_done_count = activity_statuses.filter(status=COMPLETION_STATUS[1][0]).count()
                    activity.activity_date.last()

                    if completed_count == activity_statuses_count:
                        completed += 1
                    elif not_done_count == activity_statuses_count:
                        not_done += 1
                    elif activity.activity_date.order_by(
                            'date').last().date < datetime.datetime.now().date() and completed_count > 1:
                        partially_done += 1
                    else:
                        ongoing += 1

                summary.append({
                    'organization': organization.name,
                    'completed': completed,
                    'not_done': not_done,
                    'partially_done': partially_done,
                    'ongoing': ongoing,
                    'quarter': quarter,
                    'activity_count': activities_count,
                    'year': self.start_year
                })

        return Response(summary)


class BudgetAllocationPerRegionStats(RequestSuperClass):
    def get(self, request):
        super(BudgetAllocationPerRegionStats, self).get(request)
        summary = dict()

        if self.organization != 'All':
            total_budget_filter = lambda level: Sum(
                Case(When(Q(activity_status__firstdate__gte=self.start_date) & Q(activity_status__firstdate__lte=self.end_date)
                          & Q(organization__name=self.organization)
                          & Q(level=level), then=F('activity_status__quarter_budget_usd')), default=Value(0),
                     output_field=IntegerField()))
        else:
            total_budget_filter = lambda level: Sum(
                Case(When(Q(activity_status__firstdate__gte=self.start_date) & Q(
                    activity_status__firstdate__lte=self.end_date)
                          & Q(level=level), then=F('activity_status__quarter_budget_usd')), default=Value(0),
                     output_field=IntegerField()))

        activity_funding_data = Activity.objects.aggregate(district_count=total_budget_filter(LEVEL[0][0]),
                                              national_count=total_budget_filter(LEVEL[1][0]))

        district_count = activity_funding_data['district_count']
        national_count = activity_funding_data['national_count']

        try:
            summary = {
                'district_percentage': int(round(district_count / float(district_count + national_count) * 100, 0)),
                'national_percentage': int(round(national_count / float(district_count + national_count) * 100, 0)),
                'district_count': district_count,
                'national_count': national_count
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
        unsecured_total = 0
        secured_total = 0
        grand_total = 0
        data = []

        for component in ImmunizationComponent.objects.all():
            activities = Activity.objects.filter(
                Q(immunization_component=component) &
                Q(activity_date__date__gte=datetime.datetime(self.start_year, quarter_months[self.start_quarter][0],
                                                             1)) &
                Q(activity_date__date__lte=datetime.datetime(self.start_year, quarter_months[self.end_quarter][2], 1)))

            if self.organization != 'All':
                activities = activities.filter(organization__name=replace_quotes(self.organization))

            activity_funding_data = activities.aggregate(
                isc_secured=Count(Case(
                    When(Q(funding_status=FUNDING_STATUS[0][0]) & Q(immunization_component=component), then=1),
                    output_field=IntegerField(),
                )),
                isc_unsecured=Count(Case(
                    When(Q(funding_status=FUNDING_STATUS[1][0]) & Q(immunization_component=component),
                         then=1),
                    output_field=IntegerField(),
                )),
                activity_cost_ugx=Sum('activity_cost_ugx'),
                activity_cost_usd=Sum('activity_cost_usd'),
            )
            total = activity_funding_data['isc_secured'] + activity_funding_data['isc_unsecured']
            secured_total += activity_funding_data['isc_secured']
            unsecured_total += activity_funding_data['isc_unsecured']
            grand_total += total

            if total > 0:
                data.append({
                    'component': component.name,
                    'secured': activity_funding_data['isc_secured'],
                    'unsecured': activity_funding_data['isc_unsecured'],
                    'activity_cost_ugx': activity_funding_data['activity_cost_ugx'],
                    'activity_cost_usd': activity_funding_data['activity_cost_usd'],
                    'total': total
                })

        summary = {
            'data': data,
            'secured_total': secured_total,
            'unsecured_total': unsecured_total,
            'grand_total': grand_total,
        }
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


class FundSourceMetrics(RequestSuperClass):
    def get(self, request):
        super(FundSourceMetrics, self).get(request)
        summary = []

        if self.organization != 'All':
            total_budget_filter = lambda funding_source_organization: Sum(
                Case(When(Q(activity_status__firstdate__gte=self.start_date) & Q(activity_status__firstdate__lte=self.end_date)
                          & Q(organization__name=self.organization)
                          & Q(funding_source_organization__name=funding_source_organization),
                          then=F('activity_status__quarter_budget_usd')), default=Value(0),
                     output_field=IntegerField()))

        else:
            total_budget_filter = lambda funding_source_organization: Sum(
                Case(When(Q(activity_status__firstdate__gte=self.start_date) & Q(activity_status__firstdate__lte=self.end_date)
                          & Q(funding_source_organization__name=funding_source_organization),
                          then=F('activity_status__quarter_budget_usd')), default=Value(0),
                     output_field=IntegerField()))

        for org in FundingSourceOrganization.objects.all():
            activity_funding_data = Activity.objects.aggregate(total_budget=total_budget_filter(org.name))
            summary.append({
                'name': org.name,
                'total_budget': activity_funding_data['total_budget']
            })

        # organization = FundingSourceOrganization.objects.filter()
        # if self.organization != 'All':
        #     organization = organization.filter(name=replace_quotes(self.organization))
        # organization = organization.annotate(activity_cost_usd=Sum('activity__activity_cost_usd'),
        #                                      activity_cost_ugx=Sum('activity__activity_cost_ugx'))
        # summary = organization.values('name', 'activity_cost_usd', 'activity_cost_ugx')
        return Response(summary)


class ActivityMetrics(ListCreateAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivityGetSerializer


class BudgetPerQuarterStats(RequestSuperClass):
    def get(self, request):
        super(BudgetPerQuarterStats, self).get(request)
        quarter_budget_filter = lambda quarter, year: Sum(
            Case(When(quarter=quarter, year=year, then=F('quarter_budget_usd')), default=Value(0),
                 output_field=IntegerField()))
        activity_status = ActivityStatus.objects.aggregate(q1=quarter_budget_filter(1, self.start_year),
                                                           q2=quarter_budget_filter(2, self.start_year),
                                                           q3=quarter_budget_filter(3, self.start_year),
                                                           q4=quarter_budget_filter(4, self.start_year),
                                                           q5=quarter_budget_filter(1, self.start_year + 1),
                                                           q6=quarter_budget_filter(2, self.start_year + 1))
        return Response(activity_status)


class ActivityStatusRetrieveUpdate(RetrieveUpdateAPIView):
    queryset = ActivityStatus.objects.all()
    serializer_class = ActivityStatusGetSerializer