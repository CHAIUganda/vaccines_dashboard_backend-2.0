import logging

from custom_user.models import AbstractEmailUser
from django.db import models
from django.db.models import CharField
from jsonfield import JSONField
from picklefield import PickledObjectField

MOH_CENTRAL = "MOH CENTRAL"

IIP = "IP"

DISTRICT = "District"

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


class YearMonth(models.Model):
    title = models.CharField(max_length=256, db_index=True, unique=True)
    state = PickledObjectField()

    def __unicode__(self):
        return "%s" % (self.title)

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

class Stock(models.Model):
    district = models.CharField(max_length=256, db_index=True)
    year = models.IntegerField(default=2014)
    month = models.IntegerField(choices=MONTHS, default=1)
    vaccine = models.CharField(max_length=256, db_index=True)
    at_hand = models.FloatField(default=0)
    consumed = models.FloatField(default=0)
    received = models.FloatField(default=0)

    class Meta:
        unique_together = ("district", "year", "month", "vaccine")

    def __unicode__(self):
        return "%s %d %d %s" % (self.district, self.year, self.month, self.vaccine)

