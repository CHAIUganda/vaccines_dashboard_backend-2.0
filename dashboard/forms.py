import os

from django.core.exceptions import ValidationError
from django.forms import Form, FileField, ChoiceField, ModelForm, TextInput, FileInput, Select, HiddenInput

from dashboard.helpers import *
from dashboard.models import DataUploadLog
from vaccines import settings


def validate_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.xlsm', '.xlsx', '.xls']
    if ext not in valid_extensions:
        raise ValidationError(u'Unsupported file extension.')


class FileUploadForm(Form):
    import_file = FileField(validators=[validate_file_extension])
    year = ChoiceField(choices=generate_year_labels())
    month = ChoiceField(choices=generate_months_labels())


def data_upload_choices():
    data_import_settings = settings.GENERIC_DATA_IMPORT
    choices = []

    for key in data_import_settings.keys():
        choices.append((key, data_import_settings[key]['name']))

    return choices


class DataUploadLogForm(ModelForm):
    class Meta:
        model = DataUploadLog
        fields = ['data_file', 'name', 'param1', 'param2', 'param3']
        widgets = {
            'data_file': FileInput(attrs={'class': 'form-control'}),
            'name': HiddenInput(),
            'param1': TextInput(attrs={'class': 'form-control'}),
            'param2': TextInput(attrs={'class': 'form-control'}),
            'param3': TextInput(attrs={'class': 'form-control'}),
        }
