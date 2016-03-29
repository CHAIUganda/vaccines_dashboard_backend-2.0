from rest_framework import serializers

from home.models import District, Vaccine, Facility


class DistrictSerializer(serializers.ModelSerializer):

    class Meta:
        model = District
        fields = ('district_name',)


class VaccineSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vaccine
        fields = ('vaccine_name',)



class FacilitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Facility
        fields = ('facility_code', 'facility_name', 'facility_type',)