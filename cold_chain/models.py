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

FUNDING_STATUS = (
    ("Secured", "Secured"),
    ("Unsecured", "Unsecured"),
)

IMMUNIZATION_COMPONENT = (
    ("Advocacy", "Advocacy, Communication & Social Mobilization"),
    ("Monitoring", "Monitoring, Supervision & Evaluation"),
    ("ProgrammeManagementGeneral", "Programme Management General"),
    ("ProgrammeManagementFinance", "Programme Management Finance"),
    ("ServiceDelivery", "Service Delivery & Training"),
    ("Surveillance", "Surveillance"),
    ("Vaccines", "Vaccines, Logistics, Equipment & Infrastructure"),
)

LEVEL = (
    ("District", "District"),
    ("National", "National"),
)

FUNDING_PRIORITY_LEVEL = (
    ("High", "High"),
    ("Medium", "Medium"),
    ("Low", "Low"),
)


COMPLETION_STATUS = (
    ("Completed", "Completed"),
    ("Not Done", "Not Done"),
    ("Ongoing", "Ongoing"),
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


class EligibleFacilityMetric(models.Model):
    total_eligible_facility = models.IntegerField(default=0)
    total_number_immunizing_facility = models.IntegerField(default=0)
    year = models.IntegerField(default=2019)
    month = models.IntegerField(default=6)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    cce_coverage_rate = models.IntegerField(default=0)

    def save(self, force_insert=False, force_update=False, *args, **kwargs):
        self.cce_coverage_rate = int(
            round((self.total_number_immunizing_facility / float(self.total_eligible_facility)) * 100, 0))
        super(EligibleFacilityMetric, self).save(force_insert, force_update, *args, **kwargs)


class TempReport(models.Model):
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    heat_alarm = models.IntegerField(default=0)
    cold_alarm = models.IntegerField(default=0)
    year = models.IntegerField(default=2019)
    month = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)


class Organization(models.Model):
    name = models.CharField(max_length=1000, unique=True)

    def __str__(self):
        return "%s" % (str(self.name))


class ActivityDates(models.Model):
    date = models.DateField()

    def __str__(self):
        return "%s" % (str(self.date))


class ActivityStatus(models.Model):
    year = models.IntegerField(default=2020)
    quarter = models.IntegerField(default=1)
    comment = models.TextField(null=True, blank=True)
    status = models.CharField(choices=COMPLETION_STATUS, max_length=1000, default=COMPLETION_STATUS[0][1])

    def __str__(self):
        return "%s %s" % (str(self.quarter), self.status)


class ImmunizationComponent(models.Model):
    name = models.CharField(max_length=500, unique=True, default="Advocacy, Communication & Social Mobilization")

    def __str__(self):
        return "%s" % (str(self.name))


class Activity(models.Model):
    name = models.TextField(unique=True)
    funding_status = models.CharField(choices=FUNDING_STATUS, max_length=1000, default=FUNDING_STATUS[0][0], null=True, blank=True)
    immunization_component = models.ForeignKey(ImmunizationComponent, null=True, blank=True)

    objective = models.TextField(default="", null=True, blank=True)
    level = models.CharField(choices=LEVEL, max_length=1000, default=LEVEL[0][0], null=True, blank=True)
    funding_priority_level = models.CharField(choices=FUNDING_PRIORITY_LEVEL, max_length=1000,
                                    default=FUNDING_PRIORITY_LEVEL[0][0])
    verification = models.CharField(max_length=1000, default="", null=True, blank=True)
    activity_cost_ugx = models.IntegerField(default=0, null=True, blank=True)
    activity_cost_usd = models.IntegerField(default=0, null=True, blank=True)
    budget_assumption = models.TextField(default="", null=True, blank=True)
    responsible_focal_point = models.TextField(default="", null=True, blank=True)
    stackholder_focal_point = models.TextField(default="", null=True, blank=True)
    organization = models.ForeignKey(Organization, null=True, blank=True)
    activity_date = models.ManyToManyField(ActivityDates)
    activity_status = models.ManyToManyField(ActivityStatus)

    def __str__(self):
        return "%s" % self.id


class ChangeLog(models.Model):
    activity = models.CharField(max_length=200)
    action = models.CharField(max_length=400)