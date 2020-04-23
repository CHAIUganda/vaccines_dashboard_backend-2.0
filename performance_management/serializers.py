from rest_framework import serializers
from cold_chain.models import Organization, ImmunizationComponent


class OrganizationsGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ('name',)


class ImmunizationComponentGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImmunizationComponent
        fields = ('name',)