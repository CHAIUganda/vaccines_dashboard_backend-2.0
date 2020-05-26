import datetime
import calendar
from django.utils import timezone

quarter_months = {1: [1, 2, 3],
                  2: [4, 5, 6],
                  3: [7, 8, 9],
                  4: [10, 11, 12]}

replace_quotes = lambda a: str(a).replace('\'', '').replace('\"', '')

month_to_string = lambda month: datetime.date(1900, month, 1).strftime('%b')

generate_percentage = lambda num, deno: int(round(num / float(deno) * 100, 0))


def add_months(sourcedate, months):
    month = sourcedate.month - 1 + months
    year = sourcedate.year + month // 12
    month = month % 12 + 1
    day = min(sourcedate.day, calendar.monthrange(year,month)[1])
    return timezone.datetime(year, month, day)


def encode_unicode(text):
    if type(text) == unicode:
        text = text.encode('utf-8')
    return str(text)
