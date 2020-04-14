from rest_framework import serializers
from cold_chain.models import Organization


class OrganizationsGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ('name',)