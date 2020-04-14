from django.core.serializers.json import Serializer
from django.db.models import Sum, Case, Value, When, Avg, FloatField, IntegerField
from django.db.models.expressions import F, Q, ExpressionWrapper
from rest_framework.response import Response
from rest_framework.views import APIView
from cold_chain.models import *
from utility import replace_quotes, quarter_months, month_to_string
from dateutil.relativedelta import relativedelta
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
                                       'completed_percentage',
                                       'activity_status_count')
        return Response(summary)