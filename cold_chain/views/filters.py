import django_filters

from cold_chain.models import *


class ColdFilter(django_filters.FilterSet):
    quarter = django_filters.RangeFilter(name="quarter")
    district = django_filters.CharFilter(name="district")
    facility = django_filters.CharFilter(name="facility")

    class Meta:
        model = ImmunizingFacility
        fields = ['quarter', 'district', 'facility']
