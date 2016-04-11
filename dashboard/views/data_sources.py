from collections import defaultdict

import pydash

from dashboard.data.adherence import GuidelineAdherenceCheckAdult1L, GuidelineAdherenceCheckAdult2L, GuidelineAdherenceCheckPaed1L
from dashboard.data.consumption_patients import ConsumptionAndPatientsQualityCheck
from dashboard.data.cycles import OrdersOverTimeCheck, BalancesMatchCheck, StableConsumptionCheck, StablePatientVolumesCheck
from dashboard.data.negatives import NegativeNumbersQualityCheck
from dashboard.data.nn import NNRTINEWPAEDCheck, NNRTINewAdultsCheck, NNRTICURRENTADULTSCheck, NNRTICURRENTPAEDCheck
from dashboard.helpers import FIELD_NAMES, CONSUMPTION_QUERY, FIELDS, NEW, EXISTING, F1, F2, F3, F1_QUERY, F2_QUERY, F3_QUERY, NAME, IS_ADULT, PATIENT_QUERY, RATIO, get_prev_cycle, CLOSING_BALANCE, OPENING_BALANCE, ADULT, PACKS_ORDERED, QUANTITY_RECEIVED, GUIDELINE_ADHERENCE_ADULT_1L, GUIDELINE_ADHERENCE_ADULT_2L, GUIDELINE_ADHERENCE_PAED_1L, DF1, DF2, NNRTI_NEW_PAED, NNRTI_NEW_ADULTS, NNRTI_CURRENT_ADULTS, NNRTI_CURRENT_PAED, ROWS, VALUE, COLUMN, TOTAL, OTHER, SHOW_CONVERSION
from dashboard.models import Consumption, AdultPatientsRecord, PAEDPatientsRecord

CHECK = "check"
IS_HEADER = "isHeader"
HEADERS = "headers"
RESULTS_TITLE = "results_title"
query_map = {F1: F1_QUERY, F2: F2_QUERY, F3: F3_QUERY}


def get_combination(combinations, name):
    return pydash.select(combinations, lambda x: x[NAME] == name)[0]


def get_int(value):
    try:
        return int(value), True
    except (ValueError, TypeError):
        if value is None:
            return "", False
        return value, False


class CheckDataSource():
    def __init__(self):
        pass

    def load(self, score, test, combination):
        data = self.get_context(score, test, combination)
        data["template"] = self.get_template(test)
        return data

    def get_template(self, test):
        return "check/%s.html" % test

    def get_context(self, score, test, combination):
        raise NotImplementedError()


class NegativesCheckDataSource(CheckDataSource):
    def get_context(self, score, test, combination):
        return self.get_negatives_data(score, test, combination)

    def get_negatives_data(self, score, test, combination):
        check = NegativeNumbersQualityCheck({})
        formulation_query = query_map.get(combination)
        consumption_records = Consumption.objects.filter(name=score.name, district=score.district, cycle=score.cycle, formulation__icontains=formulation_query)
        tables = []
        for consumption in consumption_records:
            formulation_data = {NAME: consumption.formulation}
            records = []
            for field in check.fields:
                raw_value, valid = get_int(getattr(consumption, field))
                records.append({COLUMN: FIELD_NAMES.get(field), VALUE: raw_value})
            formulation_data['records'] = records
            tables.append(formulation_data)
        return {"main_title": "RAW ORDER DATA", "formulations": tables}


def values_for_models(fields, models):
    output = []
    for obj in models:
        for field in fields:
            value = getattr(obj, field)
            output.append(value)
    return output


class ConsumptionAndPatientsDataSource(CheckDataSource):
    def get_context(self, score, test, combination):
        return self.get_consumption_and_patients(score, test, combination)

    def get_consumption_and_patients(self, score, test, combination_name):
        check = ConsumptionAndPatientsQualityCheck({})
        check_combination = get_combination(check.combinations, combination_name)
        formulation_query = check_combination.get(CONSUMPTION_QUERY)
        consumption_records = Consumption.objects.filter(name=score.name, district=score.district, cycle=score.cycle, formulation__icontains=formulation_query)
        model = AdultPatientsRecord if check_combination.get(IS_ADULT, False) else PAEDPatientsRecord
        patient_records = model.objects.filter(name=score.name, district=score.district, cycle=score.cycle, formulation__in=check_combination.get(PATIENT_QUERY))

        return {
            "main_title": "RAW ORDER DATA",
            "consumption": (self.calculate_consumption_tables(check_combination, consumption_records)),
            "patients": (self.calculate_patient_tables(patient_records)),
            "packs": (self.calculate_packs(check_combination)),
            "patient_totals": (self.calculate_patient_totals(patient_records)),
            "consumption_totals": (self.calculate_consumption_totals(check_combination, consumption_records))
        }

    def calculate_packs(self, check_combination):
        packs = [{COLUMN: check_combination.get(CONSUMPTION_QUERY), VALUE: check_combination.get(RATIO)}]
        return packs

    def calculate_consumption_totals(self, check_combination, consumption_records):
        totals = []
        total = 0
        for consumption in consumption_records:
            entry = {COLUMN: consumption.formulation}
            values = values_for_models(check_combination.get(FIELDS, []), [consumption])
            sum = pydash.chain(values).reject(lambda x: x is None).sum().value()
            reduced_sum = sum / check_combination[RATIO]
            entry[VALUE] = reduced_sum
            total += reduced_sum
            totals.append(entry)
        totals.append({COLUMN: TOTAL, VALUE: total, IS_HEADER: True})
        return totals

    def calculate_consumption_tables(self, check_combination, consumption_records):
        tables = []
        for consumption in consumption_records:
            formulation_data = {NAME: consumption.formulation}
            records = []
            sum = 0
            for field in check_combination.get(FIELDS, []):
                int_value, valid_int = get_int(getattr(consumption, field))
                if valid_int:
                    sum += int_value
                records.append({COLUMN: FIELD_NAMES.get(field), VALUE: int_value})
            records.append({COLUMN: TOTAL, VALUE: sum, IS_HEADER: True})

            formulation_data['records'] = records
            tables.append(formulation_data)
        return tables

    def calculate_patient_tables(self, patient_records):
        patient_tables = []
        for pr in patient_records:
            formulation_data = {NAME: pr.formulation}
            records = []
            sum = 0
            for field in [NEW, EXISTING]:
                int_value, valid_int = get_int(getattr(pr, field))
                if valid_int:
                    sum += int(int_value)
                records.append({COLUMN: FIELD_NAMES.get(field), VALUE: int_value})
            records.append({COLUMN: TOTAL, VALUE: sum, IS_HEADER: True})
            formulation_data['records'] = records
            patient_tables.append(formulation_data)
        return patient_tables

    def calculate_patient_totals(self, patient_records):
        patient_totals = []
        total = 0
        for pr in patient_records:
            entry = {COLUMN: pr.formulation}
            values = values_for_models([NEW, EXISTING], [pr])
            sum = pydash.chain(values).reject(lambda x: x is None).sum().value()
            entry[VALUE] = sum
            total += int(sum)
            patient_totals.append(entry)
        patient_totals.append({COLUMN: TOTAL, VALUE: total, IS_HEADER: True})
        return patient_totals


class TwoCycleDataSource(CheckDataSource):
    check = OrdersOverTimeCheck({}, {})

    def get_context(self, score, test, combination):

        current_cycle = score.cycle
        prev_cycle = get_prev_cycle(current_cycle)

        return {
            "main_title": "RAW ORDER DATA",
            "previous_cycle": self.get_table_for_cycle(prev_cycle, self.check, combination, score),
            "current_cycle": self.get_table_for_cycle(current_cycle, self.check, combination, score),
        }

    def get_table_for_cycle(self, cycle, check, combination, score):
        check_combination = get_combination(check.combinations, combination)
        records = self.get_queryset(check_combination, cycle, score)
        tables = [
            {"cycle": cycle}
        ]
        tables[0][ROWS] = self.build_rows(check, records)
        return tables

    def get_queryset(self, check_combination, cycle, score):
        formulation_query = check_combination.get(CONSUMPTION_QUERY)
        records = Consumption.objects.filter(name=score.name, district=score.district, cycle=cycle, formulation__icontains=formulation_query)
        return records

    def build_rows(self, check, consumption_records):
        rows = []
        for consumption in consumption_records:
            for field in check.fields:
                value = getattr(consumption, field)
                rows.append({COLUMN: FIELD_NAMES.get(field), VALUE: value})
        return rows


class ClosingBalanceMatchesOpeningBalanceDataSource(CheckDataSource):
    check = BalancesMatchCheck({}, {})

    def get_template(self, test):
        return "check/differentOrdersOverTime.html"

    def get_context(self, score, test, combination):
        current_cycle = score.cycle
        prev_cycle = get_prev_cycle(current_cycle)
        return {
            "main_title": "RAW ORDER DATA",
            "previous_cycle": self.get_table_for_cycle(prev_cycle, self.check, combination, score, [CLOSING_BALANCE]),
            "current_cycle": self.get_table_for_cycle(current_cycle, self.check, combination, score, [OPENING_BALANCE]),
        }

    def get_table_for_cycle(self, cycle, check, combination, score, fields):
        check_combination = get_combination(check.combinations, combination)
        formulation_query = check_combination.get(CONSUMPTION_QUERY)
        consumption_records = Consumption.objects.filter(name=score.name, district=score.district, cycle=cycle, formulation__icontains=formulation_query)
        tables = [
            {"cycle": cycle}
        ]
        rows = []
        for consumption in consumption_records:
            for field in fields:
                int_value, valid_int = get_int(getattr(consumption, field))
                rows.append({COLUMN: FIELD_NAMES.get(field), VALUE: int_value})
        tables[0][ROWS] = rows
        return tables


class StableConsumptionDataSource(TwoCycleDataSource):
    check = StableConsumptionCheck({}, {})

    def get_template(self, test):
        return "check/differentOrdersOverTime.html"

    def build_rows(self, check, consumption_records):
        rows = []

        for consumption in consumption_records:
            tot = 0
            for field in check.fields:
                int_value, valid_int = get_int(getattr(consumption, field))
                if valid_int:
                    tot += int_value
                rows.append({COLUMN: FIELD_NAMES.get(field), VALUE: int_value})
            rows.append({COLUMN: TOTAL, VALUE: tot, IS_HEADER: True})
        return rows


class StablePatientVolumesDataSource(TwoCycleDataSource):
    def get_template(self, test):
        return "check/differentOrdersOverTime.html"

    check = StablePatientVolumesCheck({}, {})

    def build_rows(self, check, records):
        rows = []
        total = 0
        for field in check.fields:
            value_total = 0
            for consumption in records:
                int_value, valid_int = get_int(getattr(consumption, field))
                if valid_int:
                    value_total += int_value
                    total += int_value
            rows.append({COLUMN: FIELD_NAMES.get(field), VALUE: value_total})
        rows.append({COLUMN: TOTAL, VALUE: total, IS_HEADER: True})
        return rows

    def get_queryset(self, check_combination, cycle, score):
        query = check_combination.get(PATIENT_QUERY)
        model = AdultPatientsRecord if check_combination.get(ADULT, False) else PAEDPatientsRecord
        records = model.objects.filter(name=score.name, district=score.district, cycle=cycle, formulation__in=query)
        return records


class WarehouseFulfillmentDataSource(ClosingBalanceMatchesOpeningBalanceDataSource):
    check = BalancesMatchCheck({}, {})

    def get_template(self, test):
        return "check/differentOrdersOverTime.html"

    def get_context(self, score, test, combination):
        current_cycle = score.cycle
        prev_cycle = get_prev_cycle(current_cycle)
        return {
            "main_title": "RAW ORDER DATA",
            "previous_cycle": self.get_table_for_cycle(prev_cycle, self.check, combination, score, [PACKS_ORDERED]),
            "current_cycle": self.get_table_for_cycle(current_cycle, self.check, combination, score, [QUANTITY_RECEIVED]),
        }


class GuidelineAdherenceDataSource(CheckDataSource):
    def get_template(self, test):
        return "check/adherence.html"

    checks = {
        GUIDELINE_ADHERENCE_ADULT_1L: {RESULTS_TITLE: "TDF Based as % of the Total", DF1: "TDF-based regimens", DF2: "AZT-based regimens", CHECK: GuidelineAdherenceCheckAdult1L},
        GUIDELINE_ADHERENCE_ADULT_2L: {RESULTS_TITLE: "ATV/r Based as % of the Total", DF1: "ATV/r-based regimens", DF2: "LPV/r-based regimens", CHECK: GuidelineAdherenceCheckAdult2L},
        GUIDELINE_ADHERENCE_PAED_1L: {RESULTS_TITLE: "ABC Based as % of the Total", DF1: "ABC-based regimens", DF2: "AZT-based regimens", CHECK: GuidelineAdherenceCheckPaed1L},
    }

    def get_context(self, score, test, combination):
        check_data = self.checks.get(test)
        check = check_data.get(CHECK)({})
        check_combination = check.combinations[0]
        data = {"main_title": "RAW ORDER DATA", "tables": []}
        data["result_title"] = check_data[RESULTS_TITLE]
        for part in [DF1, DF2]:
            field_names = [FIELD_NAMES.get(f) for f in check_combination.get(FIELDS)]
            table = {NAME: check_data.get(part), ROWS: [], HEADERS: field_names}
            formulation_query = check_combination.get(part)
            consumption_records = Consumption.objects.filter(name=score.name, district=score.district, cycle=score.cycle, formulation__in=formulation_query)
            totals = defaultdict(int)
            for record in consumption_records:
                row = {COLUMN: record.formulation}
                part_sum = 0
                for field in check_combination.get(FIELDS):
                    int_value, valid_int = get_int(getattr(record, field))
                    header = FIELD_NAMES.get(field)
                    if valid_int:
                        part_sum += int(int_value)
                        totals[header] += int(int_value)
                    row[header] = int_value
                row["sum"] = part_sum
                totals["sum"] += part_sum
                table[ROWS].append(row)
            table["totals"] = totals
            data["tables"].append(table)
        df1_sum = data["tables"][0]["totals"]["sum"]
        df2_sum = data["tables"][1]["totals"]["sum"]
        table_total = (df1_sum + df2_sum)
        if table_total == 0:
            score = 0
        else:
            score = (float(df1_sum) * 100) / float(table_total)
        data["score"] = score
        return data


def get_field_name(field):
    return FIELD_NAMES.get(field).replace("Consumption", "").strip()


class NNRTIDataSource(CheckDataSource):
    def get_template(self, test):
        return "check/nnrti.html"

    checks = {
        NNRTI_NEW_PAED: {CHECK: NNRTINEWPAEDCheck, "sub": "Estimated New Patients"},
        NNRTI_NEW_ADULTS: {CHECK: NNRTINewAdultsCheck, "sub": "Estimated New Patients"},
        NNRTI_CURRENT_ADULTS: {CHECK: NNRTICURRENTADULTSCheck, "sub": "Consumption"},
        NNRTI_CURRENT_PAED: {CHECK: NNRTICURRENTPAEDCheck, "sub": "Consumption"},
    }

    def get_context(self, score, test, combination):
        nnrti_titles = {DF1: "NRTI", DF2: "NNRTI/PI"}
        context = defaultdict(dict)
        context["main_title"] = "RAW ORDER DATA"
        sub_title = self.checks.get(test).get("sub")
        context["sub_title"] = sub_title
        check_config = self.checks.get(test).get(CHECK).combinations[0]

        has_other = OTHER in check_config
        for part in [DF1, DF2]:
            title = nnrti_titles.get(part)
            context[part][HEADERS] = []
            context[part]["table_header"] = title
            context[part][ROWS] = []
            ratio_key = "%s_ratios" % part
            calculated_key = "%s_calculated" % part
            context[ratio_key][ROWS] = []
            context[calculated_key][ROWS] = []
            check_fields = check_config.get(FIELDS)
            for field in check_fields:
                context[part][HEADERS].append(get_field_name(field))
            context[part][HEADERS].append(TOTAL)
            formulation_query = check_config[part]
            if has_other and part == DF2:
                formulation_query = check_config.get(OTHER) + formulation_query
            consumption_records = Consumption.objects.filter(name=score.name, district=score.district, cycle=score.cycle, formulation__in=formulation_query)
            part_total = 0
            for record in consumption_records:
                row = {COLUMN: record.formulation}

                row_sum = 0
                for field in check_fields:
                    int_value, valid_int = get_int(getattr(record, field))
                    if valid_int:
                        row_sum += int(int_value)
                    header = get_field_name(field)
                    row[header] = int_value
                row[TOTAL] = row_sum
                context[part][ROWS].append(row)
                combination_ratio = check_config.get(RATIO)
                if has_other and record.formulation in check_config.get(OTHER):
                    combination_ratio = 1.0
                ratio_row = {COLUMN: record.formulation, VALUE: combination_ratio}
                calculated_sum = row_sum / combination_ratio
                calculated_row = {COLUMN: record.formulation, VALUE: calculated_sum}
                context[ratio_key][ROWS].append(ratio_row)
                context[calculated_key][ROWS].append(calculated_row)
                part_total += calculated_sum
            context[calculated_key][ROWS].append({COLUMN: TOTAL, VALUE: part_total, IS_HEADER: True})

            context["%s_COUNT" % part] = part_total
        df1_total = context["%s_COUNT" % DF1]
        df2_total = context["%s_COUNT" % DF2]
        final_score = 0
        if df2_total > 0:
            final_score = abs(float((df2_total - df1_total) * 100) / df2_total)
        context['FINAL_SCORE'] = final_score
        context[SHOW_CONVERSION] = check_config.get(SHOW_CONVERSION)

        return context
