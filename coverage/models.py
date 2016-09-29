from __future__ import unicode_literals

from django.db import models
from custom_user.models import AbstractEmailUser
from dashboard.models import models

from django.db.models import CharField
from jsonfield import JSONField
from picklefield import PickledObjectField
from datetime import datetime, timedelta
from django.utils import timezone

class DHIS2coverage(models.Model):
    period  = models.IntegerField()
    vaccine_category = models.CharField(max_length=255)
    year = models.IntegerField()
    month = models.IntegerField(default=1)
    District = models.CharField(max_length=255)
    value = models.FloatField(default=0)

