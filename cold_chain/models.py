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
    group = models.CharField(max_length=200)


class ColdChainFacility(models.Model):
    code = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    type = models.ForeignKey(FacilityType, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Refrigerator(models.Model):
    cold_chain_facility = models.ForeignKey(ColdChainFacility, on_delete=models.SET_NULL, null=True, blank=True)
    serial_number = models.CharField(max_length=255, unique=True)
    make = models.CharField(max_length=255, unique=True)
    model = models.CharField(max_length=255, unique=True)
    available_net_storage_volume = models.IntegerField()
    required_net_storage_volume = models.IntegerField()
    temperature = models.FloatField()
    supply_year = models.DateField()
    functionality_status = models.CharField(choices=FUNCTIONALITY_STATUS, max_length=20,
                                            default=FUNCTIONALITY_STATUS[0][0])
    quarter = models.CharField(choices=QUARTERS, max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)