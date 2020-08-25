from django.core.management import BaseCommand
from dashboard import utils
from dashboard.common.temperature_data_set_downloader import TemperatureDataSetDownloader

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('period', nargs='+')

    def handle(self, *args, **options):

        period = options['period'][0]
        # url = 'https://hmis.health.go.ug/api/29/analytics/dataValueSet.json?dimension=dx:nd7C34i9jx0;go8OvDHyKzh&dimension=pe:%s&dimension=ou:USER_ORGUNIT_GRANDCHILDREN&displayProperty=NAME&user=v9f4d4loLs3' % period
        url = 'https://hmis.health.go.ug/api/29/analytics/dataValueSet.json?dimension=dx:IzNVm36SLyF;gu6piypvpy4&dimension=pe:%s&dimension=ou:LEVEL-5;akV6429SUqu&displayProperty=NAME' % period
        print(url)
        print("Fetching temperature monitoring data for Period: %s") % (period,)
        temperatureData = TemperatureDataSetDownloader(url)
        temperatureData.parse_temperature_data()
