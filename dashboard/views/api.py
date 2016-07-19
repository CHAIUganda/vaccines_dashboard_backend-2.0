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
from django.db.models import Count, Sum
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
from dashboard.views.filters import StockFilter


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
        districts = [{'name': 'Abim'},
                     {'name': 'Adjumani'},
                     {'name': 'Agago'},
                     {'name': 'Alebtong'},
                     {'name': 'Amolatar'},
                     {'name': 'Amudat'},
                     {'name': 'Amuria'},
                     {'name': 'Amuru'},
                     {'name': 'Apac'},
                     {'name': 'Arua'},
                     {'name': 'Budaka'},
                     {'name': 'Bududa'},
                     {'name': 'Bugiri'},
                     {'name': 'Buhweju'},
                     {'name': 'Buikwe'},
                     {'name': 'Bukedea'},
                     {'name': 'Bukomansimbi'},
                     {'name': 'Bukwo'},
                     {'name': 'Bulambuli'},
                     {'name': 'Buliisa'},
                     {'name': 'Bundibugyo'},
                     {'name': 'Bushenyi'},
                     {'name': 'Busia'},
                     {'name': 'Butaleja'},
                     {'name': 'Butambala'},
                     {'name': 'Buvuma'},
                     {'name': 'Buyende'},
                     {'name': 'Dokolo'},
                     {'name': 'Gomba'},
                     {'name': 'Gulu'},
                     {'name': 'Hoima'},
                     {'name': 'Ibanda'},
                     {'name': 'Iganga'},
                     {'name': 'Isingiro'},
                     {'name': 'Jinja'},
                     {'name': 'Kaabong'},
                     {'name': 'Kabale'},
                     {'name': 'Kabarole'},
                     {'name': 'Kaberamaido'},
                     {'name': 'Kalangala'},
                     {'name': 'Kaliro'},
                     {'name': 'Kalungu'},
                     {'name': 'Kampala'},
                     {'name': 'Kamuli'},
                     {'name': 'Kamwenge'},
                     {'name': 'Kanungu'},
                     {'name': 'Kapchorwa'},
                     {'name': 'Kasese'},
                     {'name': 'Katakwi'},
                     {'name': 'Kayunga'},
                     {'name': 'Kibaale'},
                     {'name': 'Kiboga'},
                     {'name': 'Kibuku'},
                     {'name': 'Kiruhura'},
                     {'name': 'Kiryandongo'},
                     {'name': 'Kisoro'},
                     {'name': 'Kitgum'},
                     {'name': 'Koboko'},
                     {'name': 'Kole'},
                     {'name': 'Kotido'},
                     {'name': 'Kumi'},
                     {'name': 'Kween'},
                     {'name': 'Kyankwanzi'},
                     {'name': 'Kyegegwa'},
                     {'name': 'Kyenjojo'},
                     {'name': 'Lamwo'},
                     {'name': 'Lira'},
                     {'name': 'Luuka'},
                     {'name': 'Luwero'},
                     {'name': 'Lwengo'},
                     {'name': 'Lyantonde'},
                     {'name': 'Manafwa'},
                     {'name': 'Maracha'},
                     {'name': 'Masaka'},
                     {'name': 'Masindi'},
                     {'name': 'Mayuge'},
                     {'name': 'Mbale'},
                     {'name': 'Mbarara'},
                     {'name': 'Mitooma'},
                     {'name': 'Mityana'},
                     {'name': 'Moroto'},
                     {'name': 'Moyo'},
                     {'name': 'Mpigi'},
                     {'name': 'Mubende'},
                     {'name': 'Mukono'},
                     {'name': 'Nakapiripirit'},
                     {'name': 'Nakaseke'},
                     {'name': 'Nakasongola'},
                     {'name': 'Namayingo'},
                     {'name': 'Namutumba'},
                     {'name': 'Napak'},
                     {'name': 'Nebbi'},
                     {'name': 'Ngora'},
                     {'name': 'Ntoroko'},
                     {'name': 'Ntungamo'},
                     {'name': 'Nwoya'},
                     {'name': 'Otuke'},
                     {'name': 'Oyam'},
                     {'name': 'Pader'},
                     {'name': 'Pallisa'},
                     {'name': 'Rakai'},
                     {'name': 'Rubirizi'},
                     {'name': 'Rukungiri'},
                     {'name': 'Sembabule'},
                     {'name': 'Serere'},
                     {'name': 'Sheema'},
                     {'name': 'Sironko'},
                     {'name': 'Soroti'},
                     {'name': 'Tororo'},
                     {'name': 'Wakiso'},
                     {'name': 'Yumbe'},
                     {'name': 'Zombo'}]
        return Response(districts)


class Vaccines(APIView):
    def get(self, request):
        vaccines = [{'name': 'MEASLES'},
                    {'name': 'BCG'},
                    {'name': 'HPV'},
                    {'name': 'HEPB'},
                    {'name': 'TT'},
                    {'name': 'TOPV'},
                    {'name': 'YELLOW FEVER'},
                    {'name': 'PCV'},
                    {'name': 'PENTA'}]
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


class StockOnHandTotal(APIView):
    def get(self, request):
        data = [{'month':'Jan 2015', 'units': 137000, 'vaccine':'MEASLES'},
               {'month':'Feb 2015', 'units': 140010, 'vaccine':'MEASLES'},
               {'month':'Mar 2015', 'units': 140010, 'vaccine':'MEASLES'},
               {'month':'Feb 2015', 'units': 140010, 'vaccine':'MEASLES'}]
        return Response(data)


class StockApi(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        vaccine = request.query_params.get('vaccine', None)

        startMonth, startYear = request.query_params.get('startMonth', None).split(' ')
        endMonth, endYear= request.query_params.get('endMonth', None).split(' ')

        date_range = ["%s-%s-%s" % (startYear, MONTH_TO_NUM[startMonth], 1), "%s-%s-%s" % (endYear, MONTH_TO_NUM[endMonth], LAST_MONTH_DAY[MONTH_TO_NUM[endMonth]])]
        args = {'firstdate__range':date_range}
        if district:
            args.update({'district': district})

        if vaccine:
            args.update({'vaccine': vaccine})

        summary = Stock.objects.filter(**args) \
            .values('district__name') \
            .annotate(stockathand=Sum('at_hand')) \
            .order_by('district__name')\
            .values('district__name', 'stockathand')

        return Response(summary)





