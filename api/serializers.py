from rest_framework import serializers

from home.models import District


class DistrictSerializer(serializers.ModelSerializer):

    class Meta:
        model = District
        fields = ('district_name')