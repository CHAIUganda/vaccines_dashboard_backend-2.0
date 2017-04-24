from django.core.serializers.json import Serializer
from django.db.models import Sum, Case, Value, When, Avg, FloatField, IntegerField
from django.db.models.expressions import F, Q, ExpressionWrapper
from rest_framework.response import Response
from rest_framework.views import APIView
from planning.models import *


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
                        'priority')\
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
                        'priority')

        return Response(summary)

