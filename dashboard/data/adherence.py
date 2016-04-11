import pydash

from dashboard.data.utils import QCheck, values_for_records, facility_not_reporting
from dashboard.helpers import *


class GuidelineAdherenceCheckAdult1L(QCheck):
    test = GUIDELINE_ADHERENCE_ADULT_1L
    combinations = [{
        NAME: DEFAULT,
        DF2: ["Zidovudine/Lamivudine (AZT/3TC) 300mg/150mg [Pack 60]",
              "Zidovudine/Lamivudine/Nevirapine (AZT/3TC/NVP) 300mg/150mg/200mg [Pack 60]"],
        DF1: ["Tenofovir/Lamivudine (TDF/3TC) 300mg/300mg [Pack 30]",
              "Tenofovir/Lamivudine/Efavirenz (TDF/3TC/EFV) 300mg/300mg/600mg[Pack 30]"],
        RATIO: 0.80,
        FIELDS: [ESTIMATED_NUMBER_OF_NEW_ART_PATIENTS, ESTIMATED_NUMBER_OF_NEW_PREGNANT_WOMEN]
    }]

    def filter_records(self, facility_name, formulation_names):
        records = self.report.cs[facility_name]

        def filter_func(x):
            for f in formulation_names:
                if f in x[FORMULATION]:
                    return True
            return False

        return pydash.select(records, filter_func)

    def for_each_facility(self, facility, no, not_reporting, yes, combination):
        facility_name = facility[NAME]
        ratio = combination[RATIO]
        df1_records = self.filter_records(facility_name, combination[DF1])
        df2_records = self.filter_records(facility_name, combination[DF2])
        df1_count = len(df1_records)
        df2_count = len(df2_records)
        df1_values = values_for_records(combination[FIELDS], df1_records)
        df2_values = values_for_records(combination[FIELDS], df2_records)
        sum_df1 = pydash.chain(df1_values).reject(lambda x: x is None).sum().value()
        sum_df2 = pydash.chain(df2_values).reject(lambda x: x is None).sum().value()
        all_df1_fields_are_blank = pydash.every(df1_values, lambda x: x is None)
        all_df2_fields_are_blank = pydash.every(df2_values, lambda x: x is None)
        return calculate_score(df1_count, df2_count, sum_df1, sum_df2, ratio, yes, no,
                               not_reporting, all_df1_fields_are_blank,
                               all_df2_fields_are_blank, facility_not_reporting(facility))


class GuidelineAdherenceCheckAdult2L(GuidelineAdherenceCheckAdult1L):
    test = GUIDELINE_ADHERENCE_ADULT_2L
    combinations = [{
        NAME: DEFAULT,
        DF2: ["Lopinavir/Ritonavir (LPV/r) 200mg/50mg [Pack 120]"],
        DF1: ["Atazanavir/Ritonavir (ATV/r) 300mg/100mg [Pack 30]"],
        RATIO: 0.73,
        FIELDS: [ESTIMATED_NUMBER_OF_NEW_ART_PATIENTS, ESTIMATED_NUMBER_OF_NEW_PREGNANT_WOMEN]
    }]


class GuidelineAdherenceCheckPaed1L(GuidelineAdherenceCheckAdult1L):
    test = GUIDELINE_ADHERENCE_PAED_1L
    combinations = [{
        NAME: 'DEFAULT',
        DF2: ["Zidovudine/Lamivudine/Nevirapine (AZT/3TC/NVP) 60mg/30mg/50mg [Pack 60]",
              "Zidovudine/Lamivudine (AZT/3TC) 60mg/30mg [Pack 60]"],
        DF1: ["Abacavir/Lamivudine (ABC/3TC) 60mg/30mg [Pack 60]"],
        RATIO: 0.80,
        FIELDS: [ESTIMATED_NUMBER_OF_NEW_ART_PATIENTS]
    }]


def calculate_score(df1_count, df2_count, sum_df1, sum_df2, ratio, yes, no, not_reporting,
                    all_df1_fields_are_blank=False, all_df2_fields_are_blank=False, facility_is_not_reporting=False):
    total = float(sum_df1 + sum_df2)
    has_blanks = (all_df2_fields_are_blank or all_df1_fields_are_blank)
    has_no_records = df1_count == 0 or df2_count == 0
    adjusted_total = (ratio * total)
    df1_is_at_least_adjusted_total = sum_df1 >= adjusted_total
    result = NOT_REPORTING
    if has_no_records or facility_is_not_reporting:
        not_reporting += 1
    elif df1_is_at_least_adjusted_total:
        yes += 1
        result = YES
    elif not df1_is_at_least_adjusted_total:
        no += 1
        result = NO
    elif not has_blanks and (sum_df1 == 0 and sum_df2 == 0):
        yes += 1
        result = YES
    elif has_blanks:
        no += 1
        result = NO
    return result, no, not_reporting, yes
