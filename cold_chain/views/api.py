from django.core.serializers.json import Serializer
from django.db.models import Sum, Case, Value, When, Avg, FloatField, IntegerField
from django.db.models.expressions import F, Q, ExpressionWrapper
from rest_framework.response import Response
from rest_framework.views import APIView
from cold_chain.helpers import *
from cold_chain.models import *


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
        districts = Facility.objects.all().values('district').distinct().order_by('district')
        return Response(districts)


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

        summary = ImmunizingFacility.objects.filter(**args)\
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

        summary = ImmunizingFacility.objects.filter (**args)\
                .values('facility__district')\
                .annotate(immunizing=(Count(Q(static='True') | Q(outreach='True'))),
                          immunizing_with_fridge=(Count(Q(static='True') & Q(outreach='True') & Q(ficc_storage='False'))),
                          Total_facilities=(Count('facility__code')))\
                .order_by('facility__district')\
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

        summary = Functionality.objects.filter()\
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

        if district:
            args.update({'facility__district': district})

        if carelevel:
            args.update({'facility__type__group': carelevel})

        if endQuarter:
            args.update({'quarter__lte': endQuarter})

        summary = Functionality.objects.filter(**args)\
                .values('facility__district')\
                .annotate(working_well = Sum('working_well'),
                          needs_maintenance = Sum('needs_maintenance'),
                          not_working = Sum('not_working'),
                          number_existing = Sum('number_existing'))\
                .order_by('-not_working')\
                .values(
                        'working_well',
                        'needs_maintenance',
                        'not_working',
                        'quarter',
                        'number_existing',
                        'facility__district')
        return Response(summary)


class FacilityRefrigerators(APIView):
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

        summary = Functionality.objects.filter(**args)\
                .values('facility__name')\
                .annotate(working_well = Sum('working_well'),
                          needs_maintenance = Sum('needs_maintenance'),
                          not_working = Sum('not_working'),
                          number_existing = Sum('number_existing'))\
                .order_by('-not_working')\
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

        summary = Capacity.objects.filter(**args)\
                .values('facility__district')\
                .annotate(required = Sum(F('required')),
                          available = Sum(F('actual')),
                          difference =Sum(F('required')-F('actual')),

                         surplus = Case(
                             When(Q(difference=Value(0))| Q(required=Value(0)), then=Value(0)),
                             default=(ExpressionWrapper( 100*F('difference') / F('required'), output_field=IntegerField()))
                         )
                         )\
                .order_by('difference')\
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

        if district:
            args.update({'facility__district': district})

        if carelevel:
            args.update({'facility__type__group': carelevel})

        if endQuarter:
            args.update({'quarter__lte': endQuarter})

        summary = Capacity.objects.filter(**args)\
                .values('facility__name')\
                .annotate(required = F('required'),
                          actual = F('actual'),
                          difference = (F('required')-F('actual')),
                          adequate = (F('actual')-F('required')),
                          surplus = Case(
                             When(Q(adequate=Value(0))| Q(required=Value(0)), then=Value(0)),
                             default=(ExpressionWrapper( 100*F('adequate') / F('required'), output_field=IntegerField()))
                         ))\
                .order_by('-difference')\
                .values(
                        'actual',
                        'adequate',
                        'required',
                        'difference',
                        'surplus',
                        'quarter',
                        'facility__name')
        return Response(summary)