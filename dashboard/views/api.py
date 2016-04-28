import csv
import json
from functools import cmp_to_key
import pydash
from arrow import now
from braces.views import LoginRequiredMixin
from django.db.models import Count, Sum
from django.http import HttpResponse
from rest_framework import filters
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models.expressions import F
from dashboard.helpers import *
from dashboard.models import Balance, YearMonth


class Months(APIView):
    def get(self, request):
        months = [{'name': 'Feb 2015'}, {'name': 'Feb 2016'}]
        return Response(months)


class Districts(APIView):
    def get(self, request):
        districts = [{'name': 'Abim'},{'name': 'Adjumani'}]
        return Response(districts)


class Vaccines(APIView):
    def get(self, request):
        vaccines = [{'name': 'MEASLES'}, \
                    {'name': 'BCG'}, \
                    {'name': 'HPV'}, \
                    {'name': 'HEPB'}, \
                    {'name': 'TT'}, \
                    {'name': 'TOPV'}, \
                    {'name': 'YELLOW FEVER'}, \
                    {'name': 'PCV'}, \
                    {'name': 'PENTA'}]
        return Response(vaccines)


class CoverageRateTotal(APIView):
    def get(self, request):
        data = "[{'month':'Jan 2015', 'units': 17000, 'vaccine':'MEASLES'}," \
               "{'month':'Feb 2015', 'units': 10010, 'vaccine':'MEASLES'}," \
               "{'month':'Mar 2015', 'units': 10010, 'vaccine':'MEASLES'}," \
               "{'month':'Feb 2015', 'units': 10010, 'vaccine':'MEASLES'}]"
        return Response(data)


class CoverageRate(APIView):
    def get(self, request):
        district = request.GET.get('district', None)
        data = "[{'month':'Jan 2015', 'units': 17000, 'vaccine':'MEASLES'}," \
               "{'month':'Feb 2015', 'units': 10010, 'vaccine':'MEASLES'}," \
               "{'month':'Mar 2015', 'units': 10010, 'vaccine':'MEASLES'}," \
               "{'month':'Feb 2015', 'units': 10010, 'vaccine':'MEASLES'}]"
        return Response(data)


class StockOnHandTotal(APIView):
    def get(self, request):
        data = "[{'month':'Jan 2015', 'units': 137000, 'vaccine':'MEASLES'}," \
               "{'month':'Feb 2015', 'units': 140010, 'vaccine':'MEASLES'}," \
               "{'month':'Mar 2015', 'units': 140010, 'vaccine':'MEASLES'}," \
               "{'month':'Feb 2015', 'units': 140010, 'vaccine':'MEASLES'}]"
        return Response(data)


class StockOnHand(APIView):
    def get(self, request):
        data = "[{'month':'Jan 2015', 'units': 137000, 'vaccine':'MEASLES', 'district': 'r'}," \
               "{'month':'Feb 2015', 'units': 140010, 'vaccine':'MEASLES', 'district': 'r'}]"
        return Response(data)
