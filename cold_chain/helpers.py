import arrow
import calendar

from arrow import Arrow, now

from datetime import date


class CustomArrow(Arrow):
    @classmethod
    def _get_frames(cls, name):
        if name in cls._ATTRS:
            return name, '{0}s'.format(name), 1
        elif name in ['week', 'weeks']:
            return 'week', 'weeks', 1
        elif name in ['quarter', 'quarters']:
            return 'quarter', 'quarters', 3
        elif cls._has_custom_frame(name):
            frame, count = name.split("=")
            return frame, '{0}s'.format(frame), int(count)
        raise AttributeError()

    @classmethod
    def _has_custom_frame(cls, name):
        parts = name.split("=")
        return len(parts) == 2 and parts[0] in cls._ATTRS

def format_range(start, end):
    return "%s - %s %s" % (start.format('Q'), end.format('Q'), start.format('YYYY'))


def generate_cycles(start, end):
    if start.quarter % 2 == 0:
        start = start.replace(quarters=-1)
    return [format_range(s, e) for s, e in CustomArrow.span_range("quarter=2", start, end)]


def generate_choices():
    return [(s, s) for s in generate_cycles(now().replace(years=-2), now().replace(years=4))]


def to_date(text):
    quarter = text.split('-')[1].strip()
    return arrow.get(quarter, 'Q YYYY')


def generate_quarters():
    quarters = []
    q = [ ('01','Q1'), ('02','Q2'), ('03','Q3'), ('04','Q4')]
    x = (date.today().month + 1)//3

    for y in range(2016, date.today().year+1):
        if y == date.today().year:
            x1 = ((date.today().month - 1) - 1) // 3 + 1
            qx = q[:x1]
        else:
            qx = q

        for z in qx:
            quarters.append({'value': '%s%s' % (y, z[0]), 'name' : '%s - %s' % (y, z[1])})


    return quarters



def generate_year_labels():
    return map(lambda x: (x, "%s"%x), range(2016, date.today().year + 1))



def isFloat(value):
    try:
        float(value)
        return True
    except:
        return False;



def generate_quarters_labels():
    return map(lambda x: (x, calendar.quarter_abbr[x]), range(1, 4))


DISTRICT = 'District'



