from django.core.management import BaseCommand

from dashboard.models import DataElement
from dashboard.utils import dhis2_request


class Command(BaseCommand):
    help = 'Find the Data Elements contained in a particular Data Set'

    def add_arguments(self, parser):
        parser.add_argument('data_set_id', nargs='+')

    def handle(self, *args, **options):
        data_set_id = options['data_set_id'][0]
        result = dhis2_request('dataSets/%s.json' % data_set_id)

        for index, de in enumerate(result['dataElements']):
            result = dhis2_request('dataElements/%s.json' % de['id'])

            print "Saving... %s. %s %s" % (index+1, result['id'], result['name'])
			
            data_element = DataElement()
            data_element.identifier = result['name']
            data_element.data_set_identifier = data_set_id
            data_element.name = result['name']
            data_element.save()
