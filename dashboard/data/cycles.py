import pydash

from dashboard.data.utils import values_for_records, build_cycle_formulation_score, facility_not_reporting, TwoCycleQCheck
from dashboard.helpers import *

THRESHOLD = "threshold"


class OrdersOverTimeCheck(TwoCycleQCheck):
    two_cycle = True
    test = DIFFERENT_ORDERS_OVER_TIME
    combinations = [
        {NAME: F1, CONSUMPTION_QUERY: F1_QUERY},
        {NAME: F2, CONSUMPTION_QUERY: F2_QUERY},
        {NAME: F3, CONSUMPTION_QUERY: F3_QUERY}
    ]
    fields = [OPENING_BALANCE, ART_CONSUMPTION, ESTIMATED_NUMBER_OF_NEW_ART_PATIENTS]

    def for_each_facility(self, facility, no, not_reporting, yes, combination):
        fields = self.fields

        prev_records = self.get_consumption_records(self.other_cycle_report, facility[NAME], combination[CONSUMPTION_QUERY])
        prev_values = values_for_records(fields, prev_records)

        current_records = self.get_consumption_records(self.report, facility[NAME], combination[CONSUMPTION_QUERY])
        current_values = values_for_records(fields, current_records)

        all_current_values_zero = pydash.every(current_values, lambda x: x == 0)
        all_prev_values_zero = pydash.every(prev_values, lambda x: x == 0)
        all_zero = all_current_values_zero and all_prev_values_zero
        if len(current_records) == 0 or len(prev_records) == 0:
            result = NOT_REPORTING
            not_reporting += 1
        elif current_values == prev_values and not all_zero:
            result = NO
            no += 1
        else:
            result = YES
            yes += 1
        return result, no, not_reporting, yes


class BalancesMatchCheck(TwoCycleQCheck):
    two_cycle = True
    test = CLOSING_BALANCE_MATCHES_OPENING_BALANCE
    combinations = [
        {NAME: F1, CONSUMPTION_QUERY: F1_QUERY},
        {NAME: F2, CONSUMPTION_QUERY: F2_QUERY},
        {NAME: F3, CONSUMPTION_QUERY: F3_QUERY}
    ]

    def for_each_facility(self, facility, no, not_reporting, yes, combination):
        result = NOT_REPORTING
        facility_name = facility[NAME]
        prev_records = self.get_consumption_records(self.other_cycle_report, facility_name,
                                                    combination[CONSUMPTION_QUERY])
        current_records = self.get_consumption_records(self.report, facility_name, combination[CONSUMPTION_QUERY])
        closing_balance_values = values_for_records([CLOSING_BALANCE], prev_records)
        opening_balance_values = values_for_records([OPENING_BALANCE], current_records)

        if self.has_no_valid_values(opening_balance_values, closing_balance_values):
            not_reporting += 1
        else:
            no, result, yes = self.compare_values(opening_balance_values[0], closing_balance_values[0], no, result, yes,
                                                  combination[CONSUMPTION_QUERY])
        return result, no, not_reporting, yes

    def compare_values(self, closing_balance, opening_balance, no, result, yes, name):
        if closing_balance != opening_balance:
            no += 1
            result = NO
        else:
            yes += 1
            result = YES
        return no, result, yes

    def has_no_valid_values(self, closing_balance_values, opening_balance_values):
        return len(closing_balance_values) == 0 or len(opening_balance_values) == 0


class StableConsumptionCheck(TwoCycleQCheck):
    two_cycle = True
    test = STABLE_CONSUMPTION
    fields = [ART_CONSUMPTION, PMTCT_CONSUMPTION]
    combinations = [
        {NAME: F1, CONSUMPTION_QUERY: F1_QUERY, THRESHOLD: 20},
        {NAME: F2, CONSUMPTION_QUERY: F2_QUERY, THRESHOLD: 10},
        {NAME: F3, CONSUMPTION_QUERY: F3_QUERY, THRESHOLD: 10}
    ]

    def for_each_combination(self, combination, scores):
        facilities = self.report.locs
        yes = 0
        no = 0
        not_reporting = 0
        total_count = 0
        formulation_name = combination[NAME]
        for facility in facilities:
            result, no, not_reporting, yes, total_count = self.for_each_facility_with_count(facility, no, not_reporting, yes, combination, total_count)
            facility['scores'][self.test][formulation_name] = result
        out = build_cycle_formulation_score(formulation_name, yes, no, not_reporting, total_count)
        scores[formulation_name] = out

    def for_each_facility_with_count(self, facility, no, not_reporting, yes, combination, total_count):
        facility_name = facility[NAME]
        prev_records = self.get_consumption_records(self.other_cycle_report, facility_name,
                                                    combination[CONSUMPTION_QUERY])
        current_records = self.get_consumption_records(self.report, facility_name, combination[CONSUMPTION_QUERY])
        threshold = combination[THRESHOLD]
        number_of_consumption_records_prev_cycle = len(prev_records)
        number_of_consumption_records_current_cycle = len(current_records)
        fields = self.fields
        current_values = values_for_records(fields, current_records)
        current_consumption = pydash.chain(current_values).reject(lambda x: x is None).sum().value()
        prev_values = values_for_records(fields, prev_records)
        prev_consumption = pydash.chain(prev_values).reject(lambda x: x is None).sum().value()
        include_record = current_consumption > threshold or prev_consumption > threshold
        result = NOT_REPORTING
        if include_record:
            total_count += 1
            numerator = float(current_consumption)
            denominator = float(prev_consumption)
            if number_of_consumption_records_prev_cycle == 0 or number_of_consumption_records_current_cycle == 0:
                not_reporting += 1
            elif denominator != 0 and (0.5 < abs(numerator / denominator) < 1.5):
                yes += 1
                result = YES
            else:
                no += 1
                result = NO
        else:
            pass
        return result, no, not_reporting, yes, total_count


class WarehouseFulfillmentCheck(TwoCycleQCheck):
    two_cycle = True
    test = WAREHOUSE_FULFILMENT
    combinations = [
        {NAME: F1, CONSUMPTION_QUERY: F1_QUERY},
        {NAME: F2, CONSUMPTION_QUERY: F2_QUERY},
        {NAME: F3, CONSUMPTION_QUERY: F3_QUERY}
    ]

    def for_each_facility(self, facility, no, not_reporting, yes, combination):
        facility_name = facility[NAME]
        prev_records = self.get_consumption_records(self.other_cycle_report, facility_name,
                                                    combination[CONSUMPTION_QUERY])
        current_records = self.get_consumption_records(self.report, facility_name, combination[CONSUMPTION_QUERY])
        count_prev = len(prev_records)
        count_current = len(current_records)
        prev_values = values_for_records([PACKS_ORDERED, ], prev_records)
        current_values = values_for_records([QUANTITY_RECEIVED], current_records)
        current_values_have_blanks = pydash.some(current_values, lambda x: x is None)
        amount_ordered = pydash.chain(prev_values).reject(lambda x: x is None).sum().value()
        amount_received = pydash.chain(current_values).reject(lambda x: x is None).sum().value()
        facility_is_not_reporting = facility_not_reporting(facility)
        result = NOT_REPORTING
        data_is_insufficient = count_prev < 1 or count_current < 1 or facility_is_not_reporting

        if data_is_insufficient:
            not_reporting += 1
        elif current_values_have_blanks:
            no += 1
            result = NO
        elif prev_values == current_values:
            yes += 1
            result = YES
        else:
            no += 1
            result = NO
        return result, no, not_reporting, yes


class StablePatientVolumesCheck(StableConsumptionCheck):
    two_cycle = True
    test = STABLE_PATIENT_VOLUMES
    combinations = [
        {NAME: F1, PATIENT_QUERY: F1_PATIENT_QUERY, ADULT: True, THRESHOLD: 10},
        {NAME: F2, PATIENT_QUERY: ["ABC/3TC/EFV", "ABC/3TC/NVP"], ADULT: False, THRESHOLD: 5},
        {NAME: F3, PATIENT_QUERY: ["ABC/3TC/EFV", "AZT/3TC/EFV"], ADULT: False, THRESHOLD: 5}
    ]
    fields = [NEW, EXISTING]

    def for_each_facility_with_count(self, facility, no, not_reporting, yes, combination, total_count):
        facility_name = facility[NAME]
        is_adult = combination[ADULT]
        prev_records = self.get_patient_records(self.other_cycle_report, facility_name,
                                                combination[PATIENT_QUERY], is_adult)
        current_records = self.get_patient_records(self.report, facility_name, combination[PATIENT_QUERY], is_adult)
        threshold = combination[THRESHOLD]
        pre_count = len(prev_records)
        current_count = len(current_records)
        current_values = values_for_records(self.fields, current_records)
        current_population = pydash.chain(current_values).reject(lambda x: x is None).sum().value()
        prev_values = values_for_records(self.fields, prev_records)
        prev_population = pydash.chain(prev_values).reject(lambda x: x is None).sum().value()
        include_record = current_population > threshold or prev_population > threshold
        result = NOT_REPORTING
        data_is_sufficient = pre_count > 0 and current_count > 0 and not facility_not_reporting(facility)
        return self.run_calculation(current_population, prev_population, total_count, not_reporting, yes, no, result, data_is_sufficient, include_record)

    def run_calculation(self, current_population, prev_population, total_count, not_reporting, yes, no, result, data_is_sufficient, include_record):
        if include_record:
            total_count += 1
            numerator = float(current_population)
            denominator = float(prev_population)
            if abs(numerator) > abs(denominator):
                numerator = float(prev_population)
                denominator = float(current_population)
            quotient = abs(numerator / denominator)
            if not data_is_sufficient:
                not_reporting += 1
            elif 0.5 < quotient < 1.0:
                yes += 1
                result = YES
            elif quotient <= 0.5 or quotient >= 1.0:
                no += 1
                result = NO
            else:
                not_reporting += 1
        else:
            pass
        return result, no, not_reporting, yes, total_count

