import json
import os
import importlib
from braces.views import LoginRequiredMixin, StaffuserRequiredMixin
from django.conf import settings
from django.contrib import messages
from django.core import serializers
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.db.models import Count, Case, When
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.views.generic import TemplateView, FormView
from dashboard.forms import FileUploadForm, DataUploadLogForm
from dashboard.models import Stock, DataUploadLog
from dashboard.tasks import import_stock_report
from dashboard.views.tables import DataUploadLogTable
from vaccines.settings import GENERIC_IMPORT_DIR


class HomeView(TemplateView):
    template_name = "home.html"

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        return context


class StockView(TemplateView):
    template_name = "stock.html"

    def get_context_data(self, **kwargs):
        context = super(StockView, self).get_context_data(**kwargs)
        return context


class FridgeView(TemplateView):
    template_name = "fridge.html"

    def get_context_data(self, **kwargs):
        context = super(FridgeView, self).get_context_data(**kwargs)
        return context


class CoverageView(TemplateView):
    template_name = "main.html"

    def get_context_data(self, **kwargs):
        context = super(CoverageView, self).get_context_data(**kwargs)
        return context



class SurveillanceView(TemplateView):
    template_name = "surveillance.html"

    def get_context_data(self, **kwargs):
        context = super(SurveillanceView, self).get_context_data(**kwargs)
        return context


class FinanceModuleView(LoginRequiredMixin, StaffuserRequiredMixin, TemplateView):
    template_name = "finance.html"


class ImportLogsView(TemplateView):
    template_name = "view_logs.html"

    def get_context_data(self, **kwargs):
        context = super(ImportLogsView, self).get_context_data(**kwargs)
        logs = DataUploadLogTable()
        context['logs'] = logs
        return context


class GenericDataImportView(LoginRequiredMixin, StaffuserRequiredMixin, TemplateView):
    template_name = "generic_import.html"

    TOTAL_PARAMS = 3

    def get_context_data(self, **kwargs):
        """
        The import settings are defined in the Settings module
         with the following name GENERIC_DATA_IMPORT
        """
        context = super(GenericDataImportView, self).get_context_data(**kwargs)
        target_settings = self.get_target_settings(kwargs)

        form = DataUploadLogForm()
        form = self.modify_form(form, target_settings)

        context['form'] = form
        context['title'] = self.get_title(target_settings)

        return context

    def post(self, request, **kwargs):
        target_settings = self.get_target_settings(kwargs)
        form = DataUploadLogForm(request.POST, request.FILES)
        form = self.modify_form(form, target_settings)

        context = {
            'form': form,
            'title': self.get_title(target_settings)
        }

        if form.is_valid():
            data_file = form.files['data_file']
            filename = ""
            if data_file is not None:
                filename = data_file.name

            obj = form.save()
            obj.name = target_settings['name']
            obj.save()

            # The first argument is the uploaded file
            uploaded_data_file = os.path.join(GENERIC_IMPORT_DIR, filename)
            args = [uploaded_data_file]

            num_params = len(target_settings['params'])
            for i in range(num_params):
                param_number = i + 1
                field_name = 'param%s' % param_number
                args.append(request.POST[field_name])

            func = self.get_function_instance(target_settings['function'])
            func(*args)

            return redirect('/import/generic/logs?success')

        return render(request, self.template_name, context)

    def get_function_instance(self, function_string):
        mod_name, func_name = function_string.rsplit('.', 1)
        mod = importlib.import_module(mod_name)
        return getattr(mod, func_name)

    def get_title(self, target_settings):
        return "IMPORT %s" % target_settings['name'].upper()

    def get_target_settings(self, kwargs):
        data_type = kwargs['data_type']
        data_import_settings = settings.GENERIC_DATA_IMPORT
        return data_import_settings[data_type]

    def modify_form(self, form, target_settings):
        num_params = len(target_settings['params'])
        for i in range(self.TOTAL_PARAMS):
            param_number = i + 1
            field_name = 'param%s' % param_number
            if param_number <= num_params:
                # Change field display name
                form.fields[field_name].label = target_settings['params'][i]
            else:
                # Remove the redundant fields
                del (form.fields[field_name])
        return form


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
        #import_stock_report.delay(tmp_file, year, month)
        import_stock_report(tmp_file, year, month)
        messages.add_message(self.request, messages.INFO, 'Successfully started import for %s %s' % (year, month))
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
        #context['year'] = year
        return context

    def build_totals(self, context):
        qs = Stock.objects.all()
        aggregates = qs.aggregate(
            count=Count('pk'),
            #MEASLES=Count(Case(When(REPORTING={DEFAULT: YES}, then=1))),

        )
        totals = dict()
        for key, value in aggregates.items():
            if key != "count":
                totals[key] = "{0:.2f}".format(float(value) * 100 / float(aggregates['count'])) + " %"
        context['totals'] = totals
