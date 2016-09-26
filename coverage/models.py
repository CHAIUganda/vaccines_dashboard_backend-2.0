from __future__ import unicode_literals

from django.db import models
from custom_user.models import AbstractEmailUser
from django.db.models import CharField
from jsonfield import JSONField
from picklefield import PickledObjectField
from datetime import datetime, timedelta
from django.utils import timezone

class DHIS2coverage(models.Model):
    period  = models.IntegerField()
    vaccine_category = models.CharField(max_length=255)
    year = models.IntegerField()
    month = models.IntegerField(choices=MONTHS, default=1)
    District = models.CharField(max_length=255)
    value = models.FloatField(default=0)

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
    'Dec': 12
}
