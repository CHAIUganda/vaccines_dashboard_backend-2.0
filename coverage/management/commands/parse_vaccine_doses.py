from django.core.management import BaseCommand
from optparse import make_option

from dashboard.common.data_set_parser import DataSetParser
from dashboard.models import DataSet
from loaddata import *

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

        #save_from_model(period)
        # save_vaccine_dose(period)

        periods = ['201606', '201607', '201608', '201609', '201610', '201611', '201612',
                   '201701', '201702', '201703', '201704', '201705', '201706', '201707',
                   '201708', '201709']

        for p in periods:
            print "Loading: %s" % p
            # save_from_model(p)
            save_vaccine_dose(p)

