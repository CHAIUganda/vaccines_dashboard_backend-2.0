import os
from unittest import TestCase

import arrow
from django.core.files.uploadedfile import SimpleUploadedFile

from dashboard.forms import FileUploadForm
from dashboard.helpers import generate_cycles


class FileUploadFormTestCase(TestCase):
    def get_fixture_path(self, name):
        file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fixtures', name)
        return file_path

    def test_xls_file_is_required(self):
        wrong_file = self.get_fixture_path('wrong_file.txt')
        upload_file = open(wrong_file, 'rb')
        year = arrow.now().format("YYYY")
        post_dict = {'cycle': ('Jan - Feb %s' % year)}
        file_dict = {'import_file': SimpleUploadedFile(upload_file.name, upload_file.read())}
        form = FileUploadForm(post_dict, file_dict)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'import_file': ['Unsupported file extension.']
        })

    def test_xls_file_is_valid(self):
        wrong_file = self.get_fixture_path('c.xlsx')
        upload_file = open(wrong_file, 'rb')
        year = arrow.now().format("YYYY")
        post_dict = {'cycle': ('Jan - Feb %s' % year)}
        file_dict = {'import_file': SimpleUploadedFile(upload_file.name, upload_file.read())}
        form = FileUploadForm(post_dict, file_dict)
        self.assertTrue(form.is_valid())


class GeneratorTestCase(TestCase):
    def test_can_generate_bi_monthly_ranges(self):
        start = arrow.Arrow(2013, 1, 1)
        end = arrow.Arrow(2014, 1, 1)
        ranges = generate_cycles(start, end)
        self.assertEqual(['Jan - Feb 2013', 'Mar - Apr 2013', 'May - Jun 2013', 'Jul - Aug 2013', 'Sep - Oct 2013', 'Nov - Dec 2013', 'Jan - Feb 2014'], ranges)
