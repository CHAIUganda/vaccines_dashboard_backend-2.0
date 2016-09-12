from django.core.management import BaseCommand
from optparse import make_option

from dashboard.common.data_set_parser import DataSetParser
from dashboard.models import DataSet


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

        data_sets = DataSet.objects.all()
        for data_set in data_sets:
            parser = DataSetParser(data_set, period)
            if options['bulk']:
                parser.bulk_import()
            else:
                parser.parse()
            parser.save_from_model()

