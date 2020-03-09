from __future__ import unicode_literals

from django.db import models
from custom_user.models import AbstractEmailUser

from django.db.models import *
from jsonfield import JSONField
from picklefield import PickledObjectField
from datetime import datetime, timedelta
from django.utils import timezone
from dashboard.models import District

QUARTER = "Quarter"

QUARTERS = (
    (1, "Q1"),
    (2, "Q2"),
    (3, "Q3"),
    (4, "Q4"),
)

FUNCTIONALITY_STATUS = (
    ("Working", "Working"),
    ("Not working", "Not working"),
    ("Needs repair", "Needs repair"),
)


class FacilityType(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name.encode('utf-8')


class ColdChainFacility(models.Model):
    code = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    type = models.ForeignKey(FacilityType, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name.encode('utf-8')


class Refrigerator(models.Model):
    cold_chain_facility = models.ForeignKey(ColdChainFacility, on_delete=models.SET_NULL, null=True, blank=True)
    serial_number = models.CharField(max_length=255, unique=True)
    make = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    supply_year = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.serial_number.encode('utf-8') + self.cold_chain_facility.name.encode('utf-8')


class RefrigeratorDetail(models.Model):
    refrigerator = models.ForeignKey(Refrigerator, on_delete=models.SET_NULL, null=True, blank=True)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    year = models.IntegerField(default=2019)
    month = models.IntegerField(default=1)
    available_net_storage_volume = models.IntegerField()
    required_net_storage_volume = models.IntegerField()
    functionality_status = models.CharField(choices=FUNCTIONALITY_STATUS, max_length=20,
                                            default=FUNCTIONALITY_STATUS[0][0])
    temperature = models.FloatField(null=True, blank=True,
                                    help_text='below 2 degrees is freeze alarm, above 8 degrees is heat alarm')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("refrigerator", "district", "year", "month")

    def __str__(self):
        return "%s %s" % (self.refrigerator, self.temperature)