import os
from braces.views import LoginRequiredMixin, StaffuserRequiredMixin
from django.conf import settings
from django.contrib import messages
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.db.models import Count, Case, When
from django.views.generic import TemplateView, FormView
from dashboard.forms import FileUploadForm
from dashboard.helpers import YES, F3, F2, F1
from dashboard.models import Score
from dashboard.tasks import import_general_report


class HomeView(LoginRequiredMixin, TemplateView):
    template_name = "home.html"

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        return context

class AboutPageView(TemplateView):
    template_name = "about.html"

class AboutTestPageView(TemplateView):
    template_name = "about_tests.html"

class AboutBackground(TemplateView):
    template_name = "about_background.html"

class AboutHowWorks(TemplateView):
    template_name = "about_works.html"

class AboutHowUsed(TemplateView):
    template_name = "about_used.html"

class DataImportView(LoginRequiredMixin, StaffuserRequiredMixin, FormView):
    template_name = "import.html"
    form_class = FileUploadForm
    success_url = '/'

    def form_valid(self, form):
        import_file = form.cleaned_data['import_file']
        cycle = form.cleaned_data['cycle']
        path = default_storage.save('tmp/workspace.xlsx', ContentFile(import_file.read()))
        tmp_file = os.path.join(settings.MEDIA_ROOT, path)
        import_general_report.delay(tmp_file, cycle)
        messages.add_message(self.request, messages.INFO, 'Successfully started import for cycle %s' % (cycle))
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
        qs = Score.objects.filter(**qs_filter)
        ips = qs.values('ip').order_by('ip').distinct()
        warehouses = qs.values('warehouse').order_by('warehouse').distinct()
        districts = qs.values('district').order_by('district').distinct()
        cycles = qs.values('cycle').distinct()
        context['districts'] = districts
        context['ips'] = ips
        context['warehouses'] = warehouses
        context['cycles'] = cycles
        context['formulations'] = [F1, F2, F3]
        return context

    def build_totals(self, context):
        qs = Score.objects.all()
        aggregates = qs.aggregate(
            count=Count('pk'),
            REPORTING=Count(Case(When(REPORTING={DEFAULT: YES}, then=1))),
            WEB_BASED=Count(Case(When(WEB_BASED={DEFAULT: YES}, then=1))),
            MULTIPLE_ORDERS=Count(Case(When(MULTIPLE_ORDERS={DEFAULT: YES}, then=1))),
            OrderFormFreeOfGaps=Count(Case(When(OrderFormFreeOfGaps={DEFAULT: YES}, then=1))),
            guidelineAdherenceAdult1L=Count(Case(When(guidelineAdherenceAdult1L={DEFAULT: YES}, then=1))),
            guidelineAdherenceAdult2L=Count(Case(When(guidelineAdherenceAdult2L={DEFAULT: YES}, then=1))),
            guidelineAdherencePaed1L=Count(Case(When(guidelineAdherencePaed1L={DEFAULT: YES}, then=1))),
            nnrtiNewPaed=Count(Case(When(nnrtiNewPaed={DEFAULT: YES}, then=1))),
            nnrtiCurrentPaed=Count(Case(When(nnrtiCurrentPaed={DEFAULT: YES}, then=1))),
            nnrtiNewAdults=Count(Case(When(nnrtiNewAdults={DEFAULT: YES}, then=1))),
            nnrtiCurrentAdults=Count(Case(When(nnrtiCurrentAdults={DEFAULT: YES}, then=1))),
        )
        totals = dict()
        for key, value in aggregates.items():
            if key != "count":
                totals[key] = "{0:.2f}".format(float(value) * 100 / float(aggregates['count'])) + " %"
        context['totals'] = totals
