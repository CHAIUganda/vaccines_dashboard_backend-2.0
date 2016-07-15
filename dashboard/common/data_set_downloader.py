from datetime import timedelta
from django.utils import timezone
from dashboard import utils
from dashboard.models import DataSyncTrackerStatus


class DataSetDownloader(object):

    def __init__(self, data_set, period, root_org_unit):
        self.data_set = data_set
        self.period = period
        self.root_org_unit = root_org_unit

    def get_download_url(self):
        period_list = self.get_period_list()
        return 'dataValueSets.json?dataSet=%s&orgUnit=%s&period=%s&children=true' % (
            self.data_set.identifier, self.root_org_unit, period_list)

    def download(self):
        download_url = self.get_download_url()
        file_name = utils.get_data_set_file_path(self.data_set.identifier, self.period)
        print "Dataset %s %s -> %s" % (self.data_set.identifier, self.period, file_name)

        utils.dhis2_request_to_file(download_url, file_name)

    def get_period_list(self):
        year = int(str(self.period)[0:4])
        month = int(str(self.period)[4:])
        return '%s%s' % (year, month)
