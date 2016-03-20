from django import forms
import os

from django.core.exceptions import ValidationError
from django.forms import Form, FileField, ChoiceField

class DocumentForm(forms.Form):
    docfile = forms.FileField(
        label='Select a file'
    )

