import os

from django.core.exceptions import ValidationError
from django.forms import Form, FileField, ChoiceField

from dashboard.helpers import *


def validate_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.xlsx', '.xls']
    if ext not in valid_extensions:
        raise ValidationError(u'Unsupported file extension.')


class FileUploadForm(Form):
    import_file = FileField(validators=[validate_file_extension])
    year = ChoiceField(choices=generate_year_labels())
    month = ChoiceField(choices=generate_months_labels())
