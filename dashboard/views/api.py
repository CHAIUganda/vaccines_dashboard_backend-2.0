import csv
import json
import json
from django.core.serializers.json import DjangoJSONEncoder, Serializer
from functools import cmp_to_key
import calendar
from django.core import serializers
import pydash
from arrow import now
from braces.views import LoginRequiredMixin
from django.db.models import Count, Sum, Avg
from django.http import HttpResponse
from rest_framework import filters
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.views import APIView
from datetime import date
import django_filters
from django.db.models.expressions import F
from dashboard.helpers import *
from dashboard.models import *
# from dashboard.views.filters import StockFilter


class ApiParams(Serializer):
    startyear = models.IntegerField(blank=True, default=None)
    startmonth = models.IntegerField(blank=True, default=None)
    endyear = models.IntegerField(blank=True, default=None)
    endmonth = models.IntegerField(blank=True, default=None)
    district = models.CharField(blank=True, default=None)
    vaccine = models.CharField(blank=True, default=None)

class Months(APIView):
    def get(self, request):
        months = generate_months()
        return Response(months)


class Districts(APIView):
    def get(self, request):
        districts = District.objects.all().values('name')
        return Response(districts)


class Vaccines(APIView):
    def get(self, request):
        vaccines = Vaccine.objects.filter(index__gt=0).values('name')
        return Response(vaccines)


class CoverageRateTotal(APIView):
    def get(self, request):
        data = [{'month':'Jan 2015', 'units': 17000, 'vaccine':'MEASLES'},
               {'month':'Feb 2015', 'units': 10010, 'vaccine':'MEASLES'},
               {'month':'Mar 2015', 'units': 10010, 'vaccine':'MEASLES'},
               {'month':'Feb 2015', 'units': 10010, 'vaccine':'MEASLES'}]
        return Response(data)


class CoverageRate(APIView):
    def get(self, request):
        district = request.GET.get('district', None)
        data = [{'month':'Jan 2015', 'units': 17000, 'vaccine':'MEASLES'},
               {'month':'Feb 2015', 'units': 10010, 'vaccine':'MEASLES'},
               {'month':'Mar 2015', 'units': 10010, 'vaccine':'MEASLES'},
               {'month':'Feb 2015', 'units': 10010, 'vaccine':'MEASLES'}]
        return Response(data)


class StockApi(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        vaccine = request.query_params.get('vaccine', None)

        startMonth, startYear = request.query_params.get('startMonth', 'Nov 2014').split(' ')
        endMonth, endYear= request.query_params.get('endMonth', 'Jan 2016').split(' ')

        date_range = ["%s-%s-%s" % (startYear, MONTH_TO_NUM[startMonth], 1), "%s-%s-%s" % (endYear, MONTH_TO_NUM[endMonth], LAST_MONTH_DAY[MONTH_TO_NUM[endMonth]])]
        args = {'firstdate__range':date_range}
        if district:
            args.update({'stock_requirement__district__name': district})

        if vaccine:
            args.update({'stock_requirement__vaccine__name': vaccine})

        summary = Stock.objects.filter(**args) \
            .values('stock_requirement__district__name') \
            .annotate(district_name=F('stock_requirement__district__name'),
                      at_hand=Sum('at_hand'),
                      ordered=Sum('ordered'),
                      consumed=Sum('consumed'))\
            .order_by('stock_requirement__district__name',) \
            .values('district_name',
                    'at_hand',
                    'ordered',
                    'consumed',
                    'stock_requirement__minimum',
                    'stock_requirement__maximum')
        return Response(summary)


class StockByMonthApi(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        vaccine = request.query_params.get('vaccine', None)

        startMonth, startYear = request.query_params.get('startMonth', 'Nov 2014').split(' ')
        endMonth, endYear= request.query_params.get('endMonth', 'Jan 2016').split(' ')

        date_range = ["%s-%s-%s" % (startYear, MONTH_TO_NUM[startMonth], 1), "%s-%s-%s" % (endYear, MONTH_TO_NUM[endMonth], LAST_MONTH_DAY[MONTH_TO_NUM[endMonth]])]
        args = {'firstdate__range':date_range}
        if district:
            args.update({'district__name': district})

        if vaccine:
            args.update({'vaccine__name': vaccine})

        summary = Stock.objects.filter(**args) \
            .values('period') \
            .annotate(stockathand=Sum('at_hand')) \
            .order_by('vaccine_name')\
            .values('period', 'stockathand')

        return Response(summary)

class AmcApi(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        vaccine = request.query_params.get('vaccine', None)

        startMonth, startYear = request.query_params.get('startMonth', 'Nov 2014').split(' ')
        endMonth, endYear= request.query_params.get('endMonth', 'Jan 2016').split(' ')

        date_range = ["%s-%s-%s" % (startYear, MONTH_TO_NUM[startMonth], 1), "%s-%s-%s" % (endYear, MONTH_TO_NUM[endMonth], LAST_MONTH_DAY[MONTH_TO_NUM[endMonth]])]
        args = {}
        if district:
            args.update({'district__name': district})

        if vaccine:
            args.update({'vaccine__name': vaccine})

        summary = DataValue.objects.filter(**args) \
                    .values( 'vaccine_category__vaccine__name') \
                    .annotate(consumption=Avg('value')) \
                    .order_by('vaccine_category__vaccine__name')\
                    .values('vaccine_category__vaccine__name', 'consumption')

        return Response(summary)


