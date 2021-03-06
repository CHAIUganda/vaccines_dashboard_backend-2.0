from django.db.models import Q
from django.shortcuts import render_to_response
from django.views.generic import View
from django_datatables_view.base_datatable_view import BaseDatatableView
from table import Table
from table.columns import Column

from dashboard.helpers import *
from dashboard.models import Stock, DataUploadLog


class ScoresTableView(BaseDatatableView):
    model = Stock
    columns = [
        DISTRICT,
        STOCK_ON_HAND,
    ]
    order_columns = columns

    def prepare_results(self, qs):
        data = []
        for item in qs:
            data.append([self.render_column(item, column) for column in self.get_columns()])
        return data

    def render_column(self, row, column):
        return super(ScoresTableView, self).render_column(row, column)

    def get_initial_queryset(self):
        qs = super(ScoresTableView, self).get_initial_queryset()
        year_month = self.request.POST.get(u'year_month', None)
        district_filter = self.request.POST.get(u'district', None)
        filters = {}
        if year_month:
            filters['cycle'] = year_month
        if district_filter:
            districts = district_filter.split(',')
            filters['district__in'] = districts

        if self.request.user:
            if self.request.user.access_level and self.request.user.access_area:
                filters[self.request.user.access_level.lower()] = self.request.user.access_area

        qs = qs.filter(**filters)
        return qs

    def filter_queryset(self, qs):
        search = self.request.POST.get(u'search[value]', None)
        if search:
            qs = qs.filter(Q(district__icontains=search))
        return qs

    def prepare_results(self, qs):
        data = []
        for item in qs:
            row = [self.render_column(item, column) for column in self.get_columns()]
            row.append(item.id)
            data.append(row)
        return data


class DataUploadLogTable(Table):
    uploaded_at = Column(field='uploaded_at', header='Upload Date', sortable=True)
    name = Column(field='name', header='Name')
    data_file = Column(field='data_file', header='Data File')
    param1 = Column(field='param1', header='Param 1')
    param2 = Column(field='param2', header='Param 2')
    param3 = Column(field='param3', header='Param 3')

    class Meta:
        model = DataUploadLog
        sort = [(5, 'desc')]
        search = False
        pagination = False
