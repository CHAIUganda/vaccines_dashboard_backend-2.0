from __future__ import unicode_literals

from django.db import models
from custom_user.models import AbstractEmailUser


from django.db.models import *




class PlannedActivities(models.Model):
    year = models.IntegerField()
    area = models.CharField(max_length=200)
    description = models.CharField(max_length=500)
    fund = models.NullBooleanField()
    priority = models.CharField(max_length=200)
    qtr1 = models.SmallIntegerField(blank=True, default=0)
    qtr2 = models.SmallIntegerField(blank=True, default=0)
    qtr3 = models.SmallIntegerField(blank=True, default=0)
    qtr4 = models.SmallIntegerField(blank=True, default=0)