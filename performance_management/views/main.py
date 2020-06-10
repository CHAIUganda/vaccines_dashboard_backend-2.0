import os
from braces.views import LoginRequiredMixin, StaffuserRequiredMixin
from django.conf import settings
from django.contrib import messages
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.views.generic import FormView
from dashboard.forms import FileUploadForm, DataUploadLogForm
from performance_management.management.commands.performance_management_command import import_performance_management


class DataImportView(LoginRequiredMixin, StaffuserRequiredMixin, FormView):
    template_name = "import.html"
    form_class = FileUploadForm
    success_url = '/'

    def form_valid(self, form):
        import_file = form.cleaned_data['import_file']
        year = form.cleaned_data['year']
        month = form.cleaned_data['month']
        path = default_storage.save('tmp/workspace.xlsm', ContentFile(import_file.read()))
        tmp_file = os.path.join(settings.MEDIA_ROOT, path)
        import_performance_management(tmp_file, year)
        messages.add_message(self.request, messages.INFO, 'Successfully started import for %s %s' % (year, month))
        return super(DataImportView, self).form_valid(form)