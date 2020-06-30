from __future__ import unicode_literals

from django.db import models
from dashboard.models import District


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

FUNDING_STATE = (
    ("Funded", "Funded"),
    ("Unfunded", "Unfunded"),
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
    ("Complete", "Complete"),
    ("Not Done", "Not Done"),
    ("Ongoing", "Ongoing"),
)


class Organization(models.Model):
    name = models.CharField(max_length=1000, unique=True)

    def __str__(self):
        return "%s" % (str(self.name))


class FundingSourceOrganization(models.Model):
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
    firstdate = models.DateField(null=True, blank=True)
    lastdate = models.DateField(null=True, blank=True)
    quarter_budget_usd = models.IntegerField(default=0, null=True, blank=True)
    status = models.CharField(choices=COMPLETION_STATUS, max_length=1000, default=COMPLETION_STATUS[0][1])

    def __str__(self):
        activity = self.activity_set.first()
        return "Activity %s - %s %s" % (str(activity.number), str(self.quarter), self.status)


class ImmunizationComponent(models.Model):
    name = models.CharField(max_length=500, unique=True, default="Advocacy, Communication & Social Mobilization")

    def __str__(self):
        return "%s" % (str(self.name))


class Activity(models.Model):
    name = models.TextField(unique=True)
    number = models.IntegerField(default=1)
    funding_status = models.CharField(choices=FUNDING_STATUS, max_length=200, default=FUNDING_STATUS[0][0], null=True, blank=True)
    funding_state = models.CharField(choices=FUNDING_STATE, max_length=200, default=FUNDING_STATE[0][0], null=True, blank=True)
    immunization_component = models.ForeignKey(ImmunizationComponent, null=True, blank=True)
    objective = models.TextField(default="", null=True, blank=True)
    level = models.CharField(choices=LEVEL, max_length=1000, default=LEVEL[0][0], null=True, blank=True)
    funding_priority_level = models.CharField(choices=FUNDING_PRIORITY_LEVEL, max_length=1000,
                                    default=FUNDING_PRIORITY_LEVEL[0][0])
    verification = models.CharField(max_length=1000, default="", null=True, blank=True)
    activity_cost_ugx = models.BigIntegerField(default=0, null=True, blank=True)
    activity_cost_usd = models.BigIntegerField(default=0, null=True, blank=True)
    budget_assumption = models.TextField(default="", null=True, blank=True)
    responsible_focal_point = models.TextField(default="", null=True, blank=True)
    stackholder_focal_point = models.TextField(default="", null=True, blank=True)
    funding_source_organization = models.ForeignKey(FundingSourceOrganization, null=True, blank=True)
    time_frame = models.TextField(default="", null=True, blank=True)
    organization = models.ForeignKey(Organization, null=True, blank=True)
    activity_date = models.ManyToManyField(ActivityDates)
    activity_status = models.ManyToManyField(ActivityStatus)

    def __str__(self):
        return "%s" % self.id


class ChangeLog(models.Model):
    activity = models.CharField(max_length=200)
    action = models.CharField(max_length=400)