
from django.core.management import BaseCommand
from dashboard import utils
from dashboard.common.new_data_set_downloader import NewDataSetDownloader

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('period', nargs='+')

    def handle(self, *args, **options):

        period = options['period'][0]
        url = 'https://hmis.health.go.ug/api/analytics/dataValueSet.json?dimension=dx:G4uZN2Y4oAG;Quc9uIBIxk6;HLyPaHaoHSu;NbG01i1Md55;dmSXPXTnV0e;QHawVF72X6E;Ys31ug5E3f1;z1s4aIzf8ga;ujs4ipzA4tb;oj4ttY118Fg;OrKSwpDxQaJ;Gtk7tbHfVfj;zcT0YplhdAB;ehj9x0CXNN5;MxAg9De4cra;MAdd47BztzL&dimension=pe:%s&dimension=ou:USER_ORGUNIT_GRANDCHILDREN&displayProperty=NAME&user=v9f4d4loLs3' % period

        print(url)
        print("Period: %s") % (period,)
        data = NewDataSetDownloader(url)
        data.parse_data()
