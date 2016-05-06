import arrow
from arrow import Arrow, now


class CustomArrow(Arrow):
    @classmethod
    def _get_frames(cls, name):
        if name in cls._ATTRS:
            return name, '{0}s'.format(name), 1
        elif name in ['week', 'weeks']:
            return 'week', 'weeks', 1
        elif name in ['quarter', 'quarters']:
            return 'quarter', 'months', 3
        elif cls._has_custom_frame(name):
            frame, count = name.split("=")
            return frame, '{0}s'.format(frame), int(count)
        raise AttributeError()

    @classmethod
    def _has_custom_frame(cls, name):
        parts = name.split("=")
        return len(parts) == 2 and parts[0] in cls._ATTRS

def format_range(start, end):
    return "%s - %s %s" % (start.format('MMM'), end.format('MMM'), start.format('YYYY'))


def generate_cycles(start, end):
    if start.month % 2 == 0:
        start = start.replace(months=-1)
    return [format_range(s, e) for s, e in CustomArrow.span_range("month=2", start, end)]


def generate_choices():
    return [(s, s) for s in generate_cycles(now().replace(years=-2), now().replace(years=4))]


def to_date(text):
    month = text.split('-')[1].strip()
    return arrow.get(month, 'MMM YYYY')


DISTRICT = 'District'
STOCK_ON_HAND = "Stock On Hand"