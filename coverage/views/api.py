from django.core.serializers.json import Serializer
from django.db.models import Sum, Case, Value, When, Avg, FloatField, IntegerField
from django.db.models.expressions import F, Q, ExpressionWrapper
from rest_framework.response import Response
from rest_framework.views import APIView
from cold_chain.helpers import *
from coverage.models import *
from collections import defaultdict

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
                                        When(Q(access__gte=90) | Q(drop_out_rate__lte=10), then=Value(1)),
                                        When(Q(access__gte=90) | Q(drop_out_rate__gt=10), then=Value(2)),
                                        When(Q(access__lt=90) | Q(drop_out_rate__lte=10), then=Value(3)),
                                        When(Q(access__lt=90) | Q(drop_out_rate__gt=10), then=Value(4)), output_field=IntegerField()),

                      )\
            .order_by('district__name')\
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
            'Red_category'
        )

        return Response(summary)