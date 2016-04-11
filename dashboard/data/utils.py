import json
import logging
import time

import pydash

from dashboard.helpers import NO, NOT_REPORTING, YES, NAME, EXISTING, NEW, FORMULATION

TWO_CYCLE = "two_cycle"

IS_INTERFACE = "is_interface"

logger = logging.getLogger(__name__)


def timeit(method):
    def timed(*args, **kw):
        ts = time.time()
        result = method(*args, **kw)
        te = time.time()

        print ('%r  %2.2f sec' % (method.__name__, te - ts))
        return result

    return timed


def clean_name(row):
    full_name = row[0].value
    replace_template = "_" + row[5].value.strip()
    return full_name.strip().replace(replace_template, "")


def reduce_to_values(records):
    def func(total, field):
        total.extend(pydash.pluck(records, field))
        return total

    return func


def values_for_records(fields, records):
    return pydash.reduce_(fields, reduce_to_values(records), [])


def get_consumption_totals(fields, records):
    return pydash.chain(values_for_records(fields, records)).reject(
        lambda x: x is None).sum().value()


def get_patient_total(records):
    return get_consumption_totals([NEW, EXISTING], records)


def calculate_percentages(no, not_reporting, total_count, yes):
    if total_count > 0:
        yes_rate = float(yes * 100) / float(total_count)
        no_rate = float(no * 100) / float(total_count)
        not_reporting_rate = float(not_reporting * 100) / float(total_count)
    else:
        no_rate = not_reporting_rate = yes_rate = 0
    return no_rate, not_reporting_rate, yes_rate


def build_cycle_formulation_score(formulation, yes, no, not_reporting, total_count):
    no, not_reporting, yes = calculate_percentages(no, not_reporting, total_count, yes)
    return {NO: no, NOT_REPORTING: not_reporting, YES: yes}


def has_blank(records, fields):
    return pydash.some(values_for_records(fields, records), lambda x: x is None)


def has_all_blanks(records, fields):
    return pydash.every(values_for_records(fields, records), lambda x: x is None)


def write_to_disk(report, file_out):
    with open(file_out, "w") as outfile:
        json.dump(report.cs, outfile)
    return report


class CheckRegistryHolder(type):
    ONE_CYCLE_CHECKS_REGISTRY = {}
    TWO_CYCLE_CHECKS_REGISTRY = {}

    def __new__(cls, name, bases, attrs):
        new_cls = type.__new__(cls, name, bases, attrs)
        if IS_INTERFACE not in attrs:
            if TWO_CYCLE in attrs:
                cls.TWO_CYCLE_CHECKS_REGISTRY[new_cls.__name__] = new_cls
            else:
                cls.ONE_CYCLE_CHECKS_REGISTRY[new_cls.__name__] = new_cls
        return new_cls


class QCheck:
    __metaclass__ = CheckRegistryHolder
    is_interface = True
    combinations = []
    test = ""

    def __init__(self, report):
        self.report = report

    def score(self):
        self.run()

    def run(self):
        scores = dict()
        for combination in self.combinations:
            self.for_each_combination(combination, scores)
        return scores

    def for_each_combination(self, combination, scores):
        facilities = self.report.locs
        yes = 0
        no = 0
        not_reporting = 0
        total_count = len(facilities)
        formulation_name = combination[NAME]
        for facility in facilities:
            result, no, not_reporting, yes = self.for_each_facility(facility, no, not_reporting, yes, combination)
            facility['scores'][self.test][formulation_name] = result
        out = build_cycle_formulation_score(formulation_name, yes, no, not_reporting, total_count)
        scores[formulation_name] = out

    def for_each_facility(self, facility, no, not_reporting, yes, combination):
        raise NotImplementedError


def facility_not_reporting(facility):
    return facility.get('status', '').strip() != 'Reporting'


def facility_has_single_order(facility):
    not_multiple = facility['Multiple'].strip() != 'Multiple orders'
    return not_multiple

def multiple_orders_score(facility):
    text_value = facility.get('Multiple', '').strip().lower()
    if 'multiple' in text_value:
        return NO
    elif 'not' in text_value:
        return NOT_REPORTING
    else:
        return YES

def get_records_from_collection(collection, facility_name):
    records = collection.get(facility_name, [])
    return records


class TwoCycleQCheck(QCheck):
    is_interface = True

    def __init__(self, report, other_cycle_report):
        QCheck.__init__(self, report)
        self.other_cycle_report = other_cycle_report

    def get_consumption_records(self, report, facility_name, formulation_name):
        records = report.cs[facility_name]
        return pydash.chain(records).reject(
            lambda x: formulation_name.strip().lower() not in x[FORMULATION].lower()
        ).value()

    def get_patient_records(self, report, facility_name, combinations, is_adult=True):
        lower_case_combinations = pydash.collect(combinations, lambda x: x.lower())
        collection = report.ads if is_adult else report.pds
        records = get_records_from_collection(collection, facility_name)
        return pydash.chain(records).select(
            lambda x: x[FORMULATION].strip().lower() in lower_case_combinations
        ).value()
