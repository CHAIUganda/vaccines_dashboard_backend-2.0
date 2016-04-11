import pydash

from dashboard.data.utils import values_for_records, QCheck, facility_not_reporting, multiple_orders_score
from dashboard.helpers import *


def has_blank_in_fields(fields):
    def func(record):
        values = values_for_records(fields, [record])
        return pydash.some(values, lambda f: f is None)

    return func


class BlanksQualityCheck(QCheck):
    test = ORDER_FORM_FREE_OF_GAPS
    combinations = [{NAME: DEFAULT}]

    fields = [OPENING_BALANCE,
              QUANTITY_RECEIVED,
              ART_CONSUMPTION,
              LOSES_ADJUSTMENTS,
              ESTIMATED_NUMBER_OF_NEW_ART_PATIENTS]

    def for_each_facility(self, facility, no, not_reporting, yes, combination):
        result = NOT_REPORTING
        facility_name = facility[NAME]
        c_records = self.report.cs[facility_name]
        a_records = self.report.ads[facility_name]
        p_records = self.report.pds[facility_name]
        cr_count = len(c_records)
        ar_count = len(a_records)
        pr_count = len(p_records)

        number_of_consumption_record_blanks = len(pydash.select(
            values_for_records(self.fields, c_records), lambda v: v is None))
        number_of_adult_records_with_blanks = len(
            pydash.select(values_for_records([NEW, EXISTING], a_records),
                          lambda v: v is None))
        number_of_paed_records_with_blanks = len(
            pydash.select(values_for_records([NEW, EXISTING], p_records),
                          lambda v: v is None))

        number_of_blanks = number_of_adult_records_with_blanks + number_of_consumption_record_blanks + number_of_paed_records_with_blanks

        if (cr_count >= 25 and ar_count >= 22 and pr_count >= 7) and number_of_blanks <= 2:
            yes += 1
            result = YES
        elif cr_count >= 25 and ar_count >= 22 and pr_count >= 7 and number_of_blanks > 2:
            no += 1
            result = NO
        elif cr_count > 0 or ar_count > 0 or pr_count > 0:
            no += 1
            result = NO
        elif cr_count == 0 and ar_count == 0 and pr_count == 0:
            not_reporting += 1
        return result, no, not_reporting, yes


class WebBasedCheck(QCheck):
    test = WEB_BASED
    combinations = [{NAME: DEFAULT}]

    def for_each_facility(self, facility, no, not_reporting, yes, combination):
        value = facility[WEB_PAPER].strip()
        if value and value in [WEB, PAPER]:
            result = value
        else:
            result = NOT_REPORTING
        if result == PAPER:
            no += 1
        elif result == WEB:
            yes += 1
        else:
            not_reporting += 1
        return result, no, not_reporting, yes


class IsReportingCheck(QCheck):
    test = REPORTING
    combinations = [{NAME: DEFAULT}]

    def for_each_facility(self, facility, no, not_reporting, yes, combination):
        result = NO if facility_not_reporting(facility) else YES
        if result == NO:
            no += 1
        else:
            yes += 1
        return result, no, not_reporting, yes


class MultipleCheck(QCheck):
    test = MULTIPLE_ORDERS
    combinations = [{NAME: DEFAULT}]

    def for_each_facility(self, facility, no, not_reporting, yes, combination):
        not_reporting += 0
        result = multiple_orders_score(facility)
        if result == NO:
            no += 1
        elif result == YES:
            yes += 1
        else:
            not_reporting +=1
        return result, no, not_reporting, yes
