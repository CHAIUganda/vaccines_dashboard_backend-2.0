import logging

from custom_user.models import AbstractEmailUser
from django.db import models
from django.db.models import CharField
from jsonfield import JSONField
from picklefield import PickledObjectField
from datetime import datetime, timedelta
from django.db import models
from django.utils import timezone

MOH_CENTRAL = "MOH CENTRAL"

IIP = "IP"

YEAR = "Year"
MONTH = "Month"
DISTRICT = "District"
VACCINE = "Vaccine"
AT_HAND = "At Hand"
WAREHOUSE = "Warehouse"

logger = logging.getLogger(__name__)
CONSUMPTION = "CONSUMPTION"
LOCATION = "Facility Index"


class DashboardUser(AbstractEmailUser):
    access_level = CharField(
        choices=(
            (WAREHOUSE, WAREHOUSE),
            (DISTRICT, DISTRICT),
            (IIP, IIP)), max_length=50)
    access_area = CharField(max_length=250, null=True, blank=True)

    def get_full_name(self):
        return self.email

    def get_short_name(self):
        return self.email

    class Meta:
        app_label = 'dashboard'


MONTHS = (
        (1, 'Jan'),
        (2, 'Feb'),
        (3, 'Mar'),
        (4, 'Apr'),
        (5, 'May'),
        (6, 'Jun'),
        (7, 'Jul'),
        (8, 'Aug'),
        (9, 'Sep'),
        (10, 'Oct'),
        (11, 'Nov'),
        (12, 'Dec'),
    )


class Region(models.Model):
    identifier = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class District(models.Model):
    identifier = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    zone = models.SmallIntegerField(blank=True, null=True)

    def __str__(self):
         return self.name


class SubCounty(models.Model):
    identifier = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name


class Facility(models.Model):
    identifier = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    sub_county = models.ForeignKey(SubCounty, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name


class DataSet(models.Model):
    identifier = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    period_type = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class DataElement(models.Model):
    identifier = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    data_set_identifier = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Vaccine(models.Model):
    name = models.CharField(max_length=255)
    index = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class VaccineCategory(models.Model):
    data_element = models.ForeignKey(DataElement)
    vaccine = models.ForeignKey(Vaccine)

    def __str__(self):
        return self.vaccine.name


class DataSetParserStatus(object):
    UNKNOWN = 0
    STARTED = 1
    COMPLETED = 2


class StockRequirement(models.Model):
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    year = models.IntegerField(default=2015)
    vaccine = models.ForeignKey(Vaccine, on_delete=models.SET_NULL, null=True, blank=True)
    minimum = models.IntegerField(default=0)
    maximum = models.IntegerField(default=0)

    class Meta:
        unique_together = ("district", "vaccine", "year")

    def __unicode__(self):
        return "%s %s %s" % (self.district, self.vaccine, self.year)


class Stock(models.Model):
    stock_requirement = models.ForeignKey(StockRequirement, on_delete=models.SET_NULL, null=True, blank=True)
    month = models.IntegerField(choices=MONTHS, default=1)
    period = models.IntegerField()
    data_element = models.ForeignKey(DataElement, on_delete=models.SET_NULL, null=True, blank=True)
    firstdate = models.DateField(auto_now=False)
    lastdate = models.DateField(auto_now=False)
    at_hand = models.FloatField(default=0)
    received = models.FloatField(default=0) # imported from xls
    ordered = models.FloatField(default=0)  # imported from xls
    consumed = models.FloatField(default=0) # import DHIS2
    planned_consumption = models.FloatField(default=0)

    class Meta:
        unique_together = ("stock_requirement", "month",)


class DataSyncTrackerStatus(object):
    UNKNOWN = 0
    INIT_DOWNLOAD = 1
    INIT_PARSE = 2
    DOWNLOADED = 3
    PARSED = 4


class DataSyncTracker(models.Model):

    period = models.IntegerField(unique=True)
    last_downloaded = models.DateTimeField(default=timezone.now)
    last_parsed = models.DateTimeField(default=timezone.now)
    status = models.IntegerField(default=0)

    @staticmethod
    def update_periods(current_period, start_period):
        #periods = utils.periods_in_ranges(start_period, current_period)
        tracked_periods = [str(dst.period) for dst in DataSyncTracker.objects.all()]
        #diff = [period for period in periods if period not in tracked_periods]

        two_day_ago = timezone.now() - timedelta(days=2)

        # for period in diff:
        #     tracker = DataSyncTracker()
        #     tracker.period = int(period)
        #     tracker.last_downloaded = two_day_ago
        #     tracker.last_parsed = two_day_ago
        #     tracker.status = DataSyncTrackerStatus.UNKNOWN
        #     tracker.save()



MONTHS_TO_STR = {
        1: 'Jan',
        2: 'Feb',
        3: 'Mar',
        4: 'Apr',
        5: 'May',
        6: 'Jun',
        7: 'Jul',
        8: 'Aug',
        9: 'Sep',
        10: 'Oct',
        11: 'Nov',
        12: 'Dec',
}


LAST_MONTH_DAY = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
}

MONTH_TO_NUM = {
    'Jan': 1,
    'Feb': 2,
    'Mar': 3,
    'Apr': 4,
    'May': 5,
    'Jun': 6,
    'Jul': 7,
    'Aug': 8,
    'Sep': 9,
    'Oct': 10,
    'Nov': 11,
    'Dec': 12,
}



