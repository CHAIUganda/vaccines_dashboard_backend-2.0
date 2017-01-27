from __future__ import unicode_literals

from django.db import models
from custom_user.models import AbstractEmailUser
from dashboard.models import *

from django.db.models import CharField
from jsonfield import JSONField
from picklefield import PickledObjectField
from datetime import datetime, timedelta
from django.utils import timezone

class DHIS2VaccineDoseDataset(models.Model):
    period  = models.IntegerField()
    vaccine = models.ForeignKey(Vaccine, on_delete=models.SET_NULL, null=True, blank=True)
    dose = models.CharField(max_length=255)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    consumed = models.FloatField(default=0)
    planned_consumption = models.FloatField(default=0)

class VaccineDose(models.Model):
    period  = models.IntegerField()
    vaccine = models.ForeignKey(Vaccine, on_delete=models.SET_NULL, null=True, blank=True)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    drop_out_rate = models.FloatField(default=0)
    under_immunized = models.FloatField(default=0)
    first_dose = models.IntegerField()
    last_dose = models.IntegerField()
    access = models.FloatField(default=0)
    coverage_rate = models.FloatField(default=0)
    planned_consumption = models.FloatField(default=0)
