import os
from braces.views import LoginRequiredMixin, StaffuserRequiredMixin
from django.conf import settings
from django.contrib import messages
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.db.models import Count, Case, When
from django.views.generic import TemplateView, FormView
from dashboard.forms import FileUploadForm
from dashboard.models import Stock
from dashboard.tasks import import_stock_report


class HomeView(LoginRequiredMixin, TemplateView):
    template_name = "home.html"

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        return context


class StockView(TemplateView):
    template_name = "stock.html"

    def get_context_data(self, **kwargs):
        context = super(StockView, self).get_context_data(**kwargs)
        return context


class FridgeView(LoginRequiredMixin, TemplateView):
    template_name = "fridge.html"

    def get_context_data(self, **kwargs):
        context = super(FridgeView, self).get_context_data(**kwargs)
        return context



class SurveillanceView(TemplateView):
    template_name = "surveillance.html"

    def get_context_data(self, **kwargs):
        context = super(SurveillanceView, self).get_context_data(**kwargs)
        return context



class DataImportView(LoginRequiredMixin, StaffuserRequiredMixin, FormView):
    template_name = "import.html"
    form_class = FileUploadForm
    success_url = '/'

    def form_valid(self, form):
        import_file = form.cleaned_data['import_file']
        year = form.cleaned_data['year']
        month = form.cleaned_data['month']
        path = default_storage.save('tmp/workspace.xlsx', ContentFile(import_file.read()))
        tmp_file = os.path.join(settings.MEDIA_ROOT, path)
        import_stock_report.delay(tmp_file, year, month)
        messages.add_message(self.request, messages.INFO, 'Successfully started import for year_month %s' % (year_month))
        return super(DataImportView, self).form_valid(form)


DEFAULT = 'DEFAULT'


class ReportsView(LoginRequiredMixin, TemplateView):
    template_name = "scores_table.html"

    def get_context_data(self, *args, **kwargs):
        context = super(ReportsView, self).get_context_data(*args, **kwargs)
        access_level = self.request.user.access_level
        access_area = self.request.user.access_area
        qs_filter = {}
        if access_level and access_area:
            qs_filter[access_level.lower()] = access_area
        qs = Stock.objects.filter(**qs_filter)
        districts = qs.values('district').order_by('district').distinct()
        cycles = qs.values('year_month').distinct()
        context['districts'] = districts
        context['year_month'] = year_month
        return context

    def build_totals(self, context):
        qs = Stock.objects.all()
        aggregates = qs.aggregate(
            count=Count('pk'),
            MEASLES=Count(Case(When(REPORTING={DEFAULT: YES}, then=1))),

        )
        totals = dict()
        for key, value in aggregates.items():
            if key != "count":
                totals[key] = "{0:.2f}".format(float(value) * 100 / float(aggregates['count'])) + " %"
        context['totals'] = totals
