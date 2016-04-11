import os

from django.core.exceptions import ValidationError
from django.forms import Form, FileField, ChoiceField

from dashboard.helpers import generate_choices


def validate_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.xlsx', '.xls']
    if ext not in valid_extensions:
        raise ValidationError(u'Unsupported file extension.')


class FileUploadForm(Form):
    import_file = FileField(validators=[validate_file_extension])
    cycle = ChoiceField(choices=generate_choices())
