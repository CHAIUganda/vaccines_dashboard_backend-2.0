from django.core.management import BaseCommand

from dashboard.common.data_set_parser import DataSetParser
from dashboard.models import DataSet


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('period', nargs='+')

    def handle(self, *args, **options):
        period = options['period'][0]
        print "Period: %s" % (period,)

        data_sets = DataSet.objects.all()
        for data_set in data_sets:
            parser = DataSetParser(data_set, period)
            parser.parse()