from django.core.serializers.json import Serializer
from django.db.models import Sum, Case, Value, When, Avg, FloatField, IntegerField
from django.db.models.expressions import F, Q, ExpressionWrapper
from rest_framework.response import Response
from rest_framework.views import APIView
from planning.models import *
from dashboard.helpers import *

class ActivityYear(APIView):
    def get(self, request):
        year = request.query_params.get('year', None)
        summary = PlannedActivities.objects.filter()\
                .values('year')\
                .distinct('year')
        return Response(summary)

class AwpActivities(APIView):
    def get(self, request):
        year = request.query_params.get('year', None)

        summary = PlannedActivities.objects.filter()\
                .values('area')\
                .annotate(
                        Q1=Sum('qtr1'),
                        Q2=Sum('qtr2'),
                        Q3=Sum('qtr3'),
                        Q4=Sum('qtr4'))\
                .order_by('area')\
                .values(
                        'year',
                        'area',
                        'Q1',
                        'Q2',
                        'Q3',
                        'Q4')
        return Response(summary)

class FundActivities(APIView):
    def get(self, request):
        year = request.query_params.get('year', None)

        summary = PlannedActivities.objects.filter()\
                .values('area',
                        'fund')\
                .annotate(
                        Q1=Sum('qtr1'),
                        Q2=Sum('qtr2'),
                        Q3=Sum('qtr3'),
                        Q4=Sum('qtr4'),

        )\
                .order_by('area')\
                .values(
                        'year',
                        'area',
                        'Q1',
                        'Q2',
                        'Q3',
                        'Q4',
                        'fund')

        return Response(summary)
class PriorityActivities(APIView):
    def get(self, request):
        year = request.query_params.get('year', None)

        summary = PlannedActivities.objects.filter()\
                .values('area',
                        'fund')\
                .annotate(
                        High=Count
                        (Case(When(priority='High', then=1),output_field=IntegerField()),
                         ),
                        Medium=Count
                        (Case(When(priority='Medium', then=1),output_field=IntegerField()),
                         ),
                        Low=Count
                        (Case(When(priority='Low', then=1),output_field=IntegerField()),
                         ),
                        Total = Count('area')
                )\
                .order_by('area')\
                .values(
                        'year',
                        'area',
                        'High',
                        'Medium',
                        'Low',
                        'fund',
                        'Total'
                        )

        return Response(summary)

