import json
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from dashboard.models import Balance, YearMonth


class FacilityScoreSerializer(ModelSerializer):
    class Meta:
        model = Balance


class JSONSerializerField(serializers.Field):
    """ Serializer for JSONField -- required to make field writable"""

    def to_internal_value(self, data):
        return data

    def to_representation(self, value):
        return value
