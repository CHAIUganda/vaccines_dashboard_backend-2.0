from __future__ import unicode_literals

from django.db import models
from custom_user.models import AbstractEmailUser


from django.db.models import *
from jsonfield import JSONField
from picklefield import PickledObjectField
from datetime import datetime, timedelta
from django.utils import timezone


QUARTER = "Quarter"

QUARTERS = (
    (1, "Q1"),
    (2, "Q2"),
    (3, "Q3"),
    (4, "Q4"),
)



class FacilityType(models.Model):
    facility_type_id = models.IntegerField()
    name = models.CharField(max_length=200)
    group = models.CharField(max_length=200)


class Facility(models.Model):
    code = models.CharField(max_length=255,unique=True)
    name = models.CharField(max_length=255)
    district = models.CharField(max_length=255)
    sub_county = models.CharField(max_length=255)
    type = models.ForeignKey(FacilityType, on_delete=models.SET_NULL, null=True, blank=True)


class ImmunizingFacility(models.Model):
    facility = models.ForeignKey(FacilityType, on_delete=models.SET_NULL, null=True, blank=True)
    static = models.NullBooleanField(blank=True)
    outreach = models.NullBooleanField(blank=False, null=True)
    ficc_storage = models.NullBooleanField(blank=True)
    quarter = models.CharField(choices=QUARTERS, max_length=20)


class Functionality(models.Model):
    facility = models.ForeignKey(Facility, on_delete=models.SET_NULL, null=True, blank=True)
    working_well = models.IntegerField()
    needs_maintenance = models.IntegerField()
    not_working = models.IntegerField()
    number_existing = models.IntegerField()


class Capacity(models.Model):
    facility = models.ForeignKey(Facility, on_delete=models.SET_NULL, null=True, blank=True)
    actual = models.CharField(max_length=200)
    required = models.CharField(max_length=200)
    difference = models.CharField(max_length=200)