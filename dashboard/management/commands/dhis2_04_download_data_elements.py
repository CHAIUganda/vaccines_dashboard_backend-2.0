from django.core.management import BaseCommand
from dashboard.models import DataElement, VaccineCategory, Vaccine
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

            print "Saving... %s. %s %s" % (index + 1, result['id'], result['name'])

            data_element = DataElement()
            data_element.identifier = result['id']
            data_element.data_set_identifier = data_set_id
            data_element.name = result['name']
            data_element.save()

            vaccine = Vaccine.objects.filter(name=result['name']).first()
            if not vaccine:
                vaccine = Vaccine()
                vaccine.name = result['name']
                vaccine.save()

            # first assume 1:1 relationship. Manual setting will be necessary through the admin page
            vaccine_category = VaccineCategory()
            vaccine_category.vaccine = vaccine
            vaccine_category.data_element = data_element
            vaccine_category.save()
