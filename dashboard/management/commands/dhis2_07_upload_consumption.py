from django.core.management import BaseCommand
from django.db.models import Sum

from dashboard.models import Region, District, SubCounty, Facility, DataElement
from dashboard.utils import dhis2_request


class Command(BaseCommand):

    def __init__(self, stdout=None, stderr=None, no_color=False):
        super(Command, self).__init__(stdout=None, stderr=None, no_color=False)
        self.period = None

    def add_arguments(self, parser):
        parser.add_argument('period', nargs='+')


    def handle(self, *args, **options):
        self.period = options['period'][0]

        print "Period: %s" % (self.period,)

        dv = DataValue.objects.get(period=self.period)

        summary = DataValue.objects.filter(period=self.period) \
            .values('district__name', 'data_element__name') \
            .annotate(consumption=Sum('value')) \
            .order_by('district__name')\
            .values('district__name', 'data_element__name', 'consumption')


        print "%s" % (dv,)
