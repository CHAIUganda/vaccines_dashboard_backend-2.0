import django_filters

from dashboard.models import Stock


class StockFilter(django_filters.FilterSet):
    year = django_filters.RangeFilter(name="year")
    month = django_filters.RangeFilter(name="month")
    district = django_filters.CharFilter(name="district")
    vaccine = django_filters.CharFilter(name="vaccine")

    class Meta:
        model = Stock
        fields = ['year', 'month', 'district', 'vaccine']
