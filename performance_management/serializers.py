from django.utils import timezone
from rest_framework import serializers
from performance_management.models import Organization, ImmunizationComponent, Activity, ActivityDates, ActivityStatus, FundingSourceOrganization


class OrganizationsGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ('name',)


class FundingSourceOrganizationsGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundingSourceOrganization
        fields = ('name',)


class ImmunizationComponentGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImmunizationComponent
        fields = ('name',)


class ActivityDatesGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityDates
        fields = '__all__'


class ActivityStatusGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityStatus
        fields = '__all__'


class ActivityGetSerializer(serializers.ModelSerializer):
    immunization_component = ImmunizationComponentGetSerializer(read_only=True)
    activity_date = ActivityDatesGetSerializer(many=True, read_only=True)
    activity_status = ActivityStatusGetSerializer(many=True, read_only=True)
    funding_source_organization = FundingSourceOrganizationsGetSerializer(read_only=True)
    organization = OrganizationsGetSerializer(read_only=True)

    class Meta:
        model = Activity
        fields = '__all__'