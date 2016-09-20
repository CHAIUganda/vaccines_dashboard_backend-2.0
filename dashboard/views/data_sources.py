from collections import defaultdict

import pydash

from dashboard.helpers import NAME

CHECK = "check"
IS_HEADER = "isHeader"
HEADERS = "headers"
RESULTS_TITLE = "results_title"


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


def values_for_models(fields, models):
    output = []
    for obj in models:
        for field in fields:
            value = getattr(obj, field)
            output.append(value)
    return output

