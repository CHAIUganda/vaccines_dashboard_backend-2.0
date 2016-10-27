from django.core.management import BaseCommand
from optparse import make_option

from dashboard.common.data_set_parser import DataSetParser
from dashboard.models import DataSet
from loaddata import save_from_model

class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option('--bulk',
                    action='store_true',
                    dest='bulk',
                    default=False,
                    help='Denote that this will be imported as bulk'),
    )

    def handle(self, *args, **options):
        period = args[0]
        print "Loading period: %s" % (period,)

        save_from_model(period)

