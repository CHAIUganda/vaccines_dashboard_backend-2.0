import json

from braces.views import LoginRequiredMixin
from django.core.serializers.json import Serializer
from django.db.models import Sum, Case, Value, When, Avg, FloatField, IntegerField
from django.db.models.expressions import F, Q, ExpressionWrapper
from django.http import HttpResponse
from django.views.generic import TemplateView
from rest_framework.response import Response
from rest_framework.views import APIView
from dashboard.helpers import *
from dashboard.models import *
from django.utils import timezone


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
        endMonth, endYear= request.query_params.get('endMonth', 'Nov 2016').split(' ')

        # Create arguments for filtering
        args = {'month': int(MONTH_TO_NUM[endMonth])}
        args.update({'stock_requirement__year': int(endYear)})

        if district and district.lower() != "national":
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
                      received=F('received'),
                      consumed=F('consumed'),
                      available_stock=ExpressionWrapper(F('received')+F('at_hand'), output_field=IntegerField()),
                      Months_stock=Case(
                                        When(Q(at_hand=Value(0)), then=Value(0)),
                                        default=(ExpressionWrapper(F('at_hand')/F('stock_requirement__minimum'), output_field=IntegerField()))
                      ),
                      uptake_rate=Case(
                          When(Q(available_stock=Value(0))| Q(consumed=Value(0)), then=Value(0)),
                          default=(ExpressionWrapper(100*F('consumed')/ F('available_stock'), output_field=IntegerField()))
                      ),
                      Refill_rate=Case(
                          When(Q(ordered=Value(0))| Q(received=Value(0)), then=Value(0)),
                          default=(ExpressionWrapper(100*F('received')/ F('ordered'), output_field=IntegerField()))
                      ),
                      coverage_rate=Case(
                          When(Q(stock_requirement__target=Value(0)) | Q(consumed=Value(0)), then=Value(0)),
                          default=(ExpressionWrapper(100 * F('consumed') / F('stock_requirement__target'), output_field=IntegerField()))
                      ),
                      not_immunized=ExpressionWrapper(F('stock_requirement__target')- F('consumed'), output_field=FloatField()),
                      planned_consumption=F('planned_consumption'),
                      vaccine=F('stock_requirement__vaccine__name'),
                      min_stock=F('stock_requirement__minimum'),
                      max_stock=F('stock_requirement__maximum'),
                      min_variance=ExpressionWrapper(F('at_hand')- F('stock_requirement__minimum'), output_field=FloatField()),
                      max_variance=ExpressionWrapper(F('at_hand')- F('stock_requirement__maximum'), output_field=FloatField()))\
            .order_by('district_name')\
            .values('district_name',
                    'stock_requirement__district__zone',
                    'at_hand',
                    'period',
                    'Refill_rate',
                    'Months_stock',
                    'period_month',
                    'period_year',
                    'ordered',
                    'consumed',
                    'planned_consumption',
                    'stock_requirement__target',
                    'stock_requirement__coverage_target',
                    'vaccine',
                    'stock_requirement__minimum',
                    'stock_requirement__maximum',
                    'min_variance',
                    'max_variance',
                    'uptake_rate',
                    'coverage_rate',
                    'not_immunized',
                    'available_stock',
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
                            'stock_requirement__target',
                            'stock_requirement__coverage_target',
                            'stock_requirement__minimum',
                            'stock_requirement__maximum',
                            'min_variance',
                            'max_variance')

        return Response(summary)


class StockByDistrictVaccineApi(APIView):
    def month_to_number(self, month):
        month_map = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10,
                'Nov': 11, 'Dec': 12}
        return "%02d" % month_map[month]

    def get(self, request):
        district = request.query_params.get('district', None)
        districts = request.query_params.get('districts', None)
        vaccine = request.query_params.get('vaccine', "PENTA")
        #month = request.query_params.get('month', None)

        startMonth, startYear = request.query_params.get('startMonth', 'Jan 2016').split(' ')
        endMonth, endYear= request.query_params.get('endMonth', 'Jul 2016').split(' ')

        # Create arguments for filtering
        args = {'month__gte': int(MONTH_TO_NUM[startMonth])}
        args.update({'month__lte': int(MONTH_TO_NUM[endMonth])})
        args.update({'stock_requirement__year': int(endYear)})

        # Fixed the filtering above
        start_period = int("%s%02d" % (startYear, MONTH_TO_NUM[startMonth]))
        end_period = int("%s%02d" % (endYear, MONTH_TO_NUM[endMonth]))

        args = {'period__gte': start_period, 'period__lte': end_period}

        if vaccine:
            args.update({'stock_requirement__vaccine__name': vaccine})

        grouping_fields = None

        if district:
            if district.lower() != "national":
                args.update({'stock_requirement__district__name': district})
            else:
                grouping_fields = ['period']

        if districts:
            districts = eval(districts)
            # contains lists of dictionaries, the lists are created when needed
            summary = []

            for district in districts:
                args.update({'stock_requirement__district__name': district})
                for i, obj in enumerate(self.get_summary(args, None)):
                    try:
                        summary[i].append(obj)
                    except IndexError as e:
                        print(e)
                        summary.append([obj])
        else:
            summary = self.get_summary(args, grouping_fields)

        return Response(summary)

    def get_summary(self, args, grouping_fields):
        summary = Stock.objects.filter(**args)
        if grouping_fields:
            print("grouping [%s]" % grouping_fields)
            summary = summary.order_by('period', ).values(*grouping_fields) \
                .annotate(total_consumed=Sum('consumed'),
                          total_received=Sum('received'),
                          total_at_hand=Sum('at_hand'),
                          total_ordered=Sum('ordered'),
                          total_target=Sum('stock_requirement__target'))
        else:
            summary = summary.order_by('period', ) \
                .values('stock_requirement__district__name',
                        'stock_requirement__vaccine__name',
                        'stock_requirement__minimum',
                        'stock_requirement__maximum',
                        'month',
                        'stock_requirement__target',
                        'stock_requirement__coverage_target',
                        'consumed',
                        'stock_requirement__district__zone',
                        'at_hand',
                        'period',
                        'ordered',
                        'received')
        return summary


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


class LastPeriod(APIView):
    def get(self, request):


        summary = Stock.objects.all()\
            .order_by('period')\
            .values('period')\
            .distinct()

        return Response(summary.last())


class FinanceListApiView(LoginRequiredMixin, APIView):
    def get(self, request, *args, **kwargs):
        start_year = request.query_params.get('startYear', 0)
        end_year = request.query_params.get('endYear', 0)

        results = Financing.objects\
            .filter(period__gte=start_year, period__lte=end_year)\
            .values('period', 'gavi_approved', 'gavi_disbursed', 'gou_approved', 'gou_disbursed')\
            .order_by('period')
        return Response(results)


class FinanceYearsApiView(APIView):
    def get(self, request, *args, **kwargs):
        results = Financing.objects\
            .order_by('period')\
            .values_list('period', flat=True)
        return Response(results)


class FinanceUpdateApiView(LoginRequiredMixin, TemplateView):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        data_row = Financing.objects.filter(period=data['period']).first()

        if data_row is None:
            data_row = Financing()

        data_row.period = data['period']
        data_row.gavi_approved = data['gavi_approved']
        data_row.gavi_disbursed = data['gavi_disbursed']
        data_row.gou_approved = data['gou_approved']
        data_row.gou_disbursed = data['gou_disbursed']
        data_row.save()

        return HttpResponse("ok")