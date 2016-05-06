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


class Balance(models.Model):
    district = models.CharField(max_length=256, db_index=True)
    month = models.ForeignKey(YearMonth, db_index=True)
    measles = models.FloatField(default=0)
    bcg = models.FloatField(default=0)
    hpv = models.FloatField(default=0)
    hepb = models.FloatField(default=0)
    tt = models.FloatField(default=0)
    topv = models.FloatField(default=0)
    yellowfever = models.FloatField(default=0)
    pcv = models.FloatField(default=0)
    penta = models.FloatField(default=0)

    class Meta:
        unique_together = ("district", "month")

