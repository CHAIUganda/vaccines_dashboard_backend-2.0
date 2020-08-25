from django.core.exceptions import ObjectDoesNotExist
from django.core.management import BaseCommand
from dashboard.models import Region, District, SubCounty, Facility
from dashboard.utils import dhis2_request, dhis2_request_new


def store_children(parent_org_unit, child_model):
    for child_org_unit in parent_org_unit['children']:

        try:
            # Throws error when unit already exists
            child_model.objects.get(identifier=child_org_unit['id'])

        except ObjectDoesNotExist:
            result = dhis2_request('organisationUnits/%s.json' % child_org_unit['id'])

            child_model_instance = child_model()
            child_model_instance.identifier = child_org_unit['id']
            child_model_instance.name = result['name']
            child_model_instance.save()

def store_children_new(parent_org_unit, child_model):

    try:
        for child_org_unit in parent_org_unit['children']:

            try:
                # Throws error when unit already exists
                element = child_model.objects.get(identifier=child_org_unit['id'])
                print("%s already exists" % element.name)

            except ObjectDoesNotExist:
                result = dhis2_request_new('organisationUnits/%s.json' % child_org_unit['id'])
                print("%s does not exist, creating it now...." % result["name"])

                child_model_instance = child_model()
                child_model_instance.identifier = child_org_unit['id']
                child_model_instance.name = result['name']
                child_model_instance.save()
    except KeyError:
        print("%s" % parent_org_unit["message"])

class Command(BaseCommand):
    help = 'Download the Org Units, Regions, Districts, Sub Counties and Facilities'

    def add_arguments(self, parser):
        parser.add_argument('unit', nargs='+')

    def handle(self, *args, **options):
        root_org_unit = 'akV6429SUqu'  # MOH - Uganda
        unit = options['unit'][0]

        if unit == 'region':
            root_org_unit = dhis2_request('organisationUnits/%s.json' % root_org_unit)
            store_children(root_org_unit, Region)

        elif unit == 'region_new':
            root_org_unit = dhis2_request_new('organisationUnits/%s.json' % root_org_unit)
            store_children_new(root_org_unit, Region)

        elif unit == 'district':
            regions = Region.objects.all()
            for region in regions:
                region_org_unit = dhis2_request('organisationUnits/%s.json' % region.identifier)
                store_children(region_org_unit, District)

        elif unit == 'district_new':
            # Return only new DHIS2 regions
            regions = Region.objects.filter(id__gte=5)
            for region in regions:
                # print(region.name)
                region_org_unit = dhis2_request_new('organisationUnits/%s.json' % region.identifier)
                store_children_new(region_org_unit, District)

        elif unit == 'subcounty':
            districts = District.objects.all()
            for district in districts:
                district_org_unit = dhis2_request('organisationUnits/%s.json' % district.identifier)
                store_children(district_org_unit, SubCounty)

        elif unit == 'subcounty_new':
            districts = District.objects.all()
            for district in districts:
                district_org_unit = dhis2_request_new('organisationUnits/%s.json' % district.identifier)
                store_children_new(district_org_unit, SubCounty)

        elif unit == 'facility_new':
            subconties = SubCounty.objects.all()
            for subcounty in subconties:
                subcounty_org_unit = dhis2_request_new('organisationUnits/%s.json' % subcounty.identifier)
                store_children_new(subcounty_org_unit, Facility)

        else:
            self.stdout.write(self.style.NOTICE('Unknown unit [%s]' % options['unit']))
