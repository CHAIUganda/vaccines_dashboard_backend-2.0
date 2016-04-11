from django.test import TestCase
from dashboard.data.cycles import StablePatientVolumesCheck
from dashboard.helpers import NOT_REPORTING


class PatientStabilityTestCase(TestCase):
    def test_that_check_fails_if_30_in_prev_and_59_in_next(self):
        check = StablePatientVolumesCheck({}, {})
        current_population = 30
        prev_population = 59
        total_count = 0
        not_reporting = 0
        yes = 0
        no = 0
        result = NOT_REPORTING
        data_is_sufficient = True
        include_record = True
        result, no, not_reporting, yes, total_count = check.run_calculation(current_population, prev_population, total_count, not_reporting, yes, no, result, data_is_sufficient, include_record)
        self.assertEquals(result, "YES")
