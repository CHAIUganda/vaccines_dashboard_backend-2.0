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
        carelevel = request.query_params.get('group', None)
        quarter = request.query_params.get('quarter', None)

        summary = ImmunizingFacility.objects.filter()\
                .order_by('facility__facility__code' )\
                .values(
                        'facility__facility__district',
                        'facility__facility_type_id',
                        'facility__facility__name',
                        'facility',
                        'facility__group',
                        'facility__facility__code',
                        'quarter',
                        'static',
                        'outreach',
                        'ficc_storage')
        return Response(summary)
