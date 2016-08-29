from django.core.serializers.json import Serializer
from django.db.models import Sum, Avg, FloatField
from django.db.models.expressions import F, ExpressionWrapper
from rest_framework.response import Response
from rest_framework.views import APIView
from dashboard.helpers import *
from dashboard.models import *


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
        districts = District.objects.all().values('name').order_by('name')
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


class StockAtHandByDistrictApi(APIView):
    def get(self, request):
        # Get the parameters
        district = request.query_params.get('district', None)
        vaccine = request.query_params.get('vaccine', None)
        zone = request.query_params.get('zone', None)


        startMonth, startYear = request.query_params.get('startMonth', 'Nov 2014').split(' ')
        endMonth, endYear= request.query_params.get('endMonth', 'Jul 2016').split(' ')

        # Create arguments for filtering
        args = {'month': int(MONTH_TO_NUM[endMonth])}
        args.update({'stock_requirement__year': int(endYear)});

        if district:
            args.update({'stock_requirement__district__name': district})

        if vaccine:
            args.update({'stock_requirement__vaccine__name': vaccine})

        if zone:
            args.update({'stock_requirement__district__zone': zone})

        summary = Stock.objects.filter(**args) \
            .values('stock_requirement__district__name') \
            .annotate(district_name=F('stock_requirement__district__name'),
                      total_at_hand=F('at_hand'),
                      period=F('period'),
                      period_month=F('month'),
                      period_year=F('stock_requirement__year'),
                      ordered=F('ordered'),
                      consumed=F('consumed'),
                      planned_consumption=F('planned_consumption'),
                      vaccine=F('stock_requirement__vaccine__name'),
                      min_stock=F('stock_requirement__minimum'),
                      max_stock=F('stock_requirement__maximum'),
                      min_variance=ExpressionWrapper(F('at_hand')- F('stock_requirement__minimum'), output_field=FloatField()),
                      max_variance=ExpressionWrapper(F('at_hand')- F('stock_requirement__maximum'), output_field=FloatField()))\
            .order_by('at_hand')\
            .values('district_name',
                    'stock_requirement__district__zone',
                    'at_hand',
                    'period',
                    'period_month',
                    'period_year',
                    'ordered',
                    'consumed',
                    'planned_consumption',
                    'vaccine',
                    'stock_requirement__minimum',
                    'stock_requirement__maximum',
                    'min_variance',
                    'max_variance',
                    'received')

        return Response(summary)


class StockAtHandByMonthApi(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        vaccine = request.query_params.get('vaccine', None)

        # Create arguments for filtering
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
                              period=F('period'),
                              period_month=F('month'),
                              period_year=F('stock_requirement__year'),
                              vaccine=F('stock_requirement__vaccine__name'),
                              at_hand=F('at_hand'),
                              ordered=F('ordered'),
                              consumed=F('consumed'),
                              min_stock=F('stock_requirement__minimum'),
                              max_stock=F('stock_requirement__maximum'),
                              min_variance=ExpressionWrapper(F('at_hand')- F('stock_requirement__minimum'), output_field=FloatField()),
                              max_variance=ExpressionWrapper(F('at_hand')- F('stock_requirement__maximum'), output_field=FloatField()))\
                    .order_by('stock_requirement__district__name',) \
                    .values('district_name',
                            'period',
                            'period_month',
                            'period_year',
                            'vaccine',
                            'at_hand',
                            'ordered',
                            'consumed',
                            'stock_requirement__minimum',
                            'stock_requirement__maximum',
                            'min_variance',
                            'max_variance')

        return Response(summary)


class ConsumptionApi(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        vaccine = request.query_params.get('vaccine', None)
        year = request.query_params.get('year', None)
        month = request.query_params.get('month', None)

        args = {}

        if vaccine:
            args.update({'stock_requirement__district__name': district})
            args.update({'stock_requirement__year': year})
            args.update({'stock_requirement__month': month})
            args.update({'stock_requirement__vaccine__name': vaccine})

        summary = Stock.objects.filter(**args) \
                .values('stock_requirement__district__name',
                        'stock_requirement__vaccine__name',
                        'consumed')

        return Response(summary)


class StockMonthsLeftAPI(APIView):
    def get(self, request):
        district = request.query_params.get('district', None)
        vaccine = request.query_params.get('vaccine', None)
        year = request.query_params.get('year', None)

        args = {}

        if vaccine:
            args.update({'stock_requirement__district__name': district})
            args.update({'stock_requirement__year': year})
            args.update({'stock_requirement__vaccine__name': vaccine})

        import datetime

        currentMonth = datetime.datetime.now().month
        args.update({'month': currentMonth - 1})

        summary = Stock.objects.filter(**args) \
                .annotate(stock_left=ExpressionWrapper(F('at_hand')/F('stock_requirement__maximum'), output_field=FloatField())) \
                .values('stock_requirement__district__name',
                        'at_hand',
                        'stock_requirement__maximum',
                        'stock_left')

        return Response(summary)