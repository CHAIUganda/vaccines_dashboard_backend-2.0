from django.test import TestCase
from dashboard.views.data_sources import GuidelineAdherenceDataSource

class AdherenceDataSourceTestCase(TestCase):

    def test_that_correct_template_is_provided(self):
        data_source = GuidelineAdherenceDataSource()
        self.assertEquals("check/adherence.html", data_source.get_template(""))
