from datetime import date, datetime
import operator
import requests
#
# from vaccines.settings import DHIS2_USER, DHIS2_PASS, DHIS2_ADDRESS, BASE_DIR
#

from vaccines.settings import BASE_DIR


DHIS2_USER = 'qppu2'
DHIS2_PASS = 'DoctorTeam31'
DHIS2_ADDRESS = 'http://hmis2.health.go.ug/'

def get_data_set_file_path(data_set_identifier, period):
    # return "D:\vaccines\data_set_%s_%s.json" % (data_set.identifier, period)
    return "%s/downloads/data_set_%s_%s.json" % (BASE_DIR, data_set_identifier, period)


def dhis2_request(resource):
    url = '%s/hmis2/api/%s' % (DHIS2_ADDRESS,resource)
    result = requests.get(url, auth=(DHIS2_USER, DHIS2_PASS))
    return result.json()


def dhis2_request_to_file(resource, file_name):
    url = '%s/hmis2/api/%s' % (DHIS2_ADDRESS,resource)
    print 'Fetching [%s]' % url
    result = requests.get(url, auth=(DHIS2_USER, DHIS2_PASS), stream=True)

    with open(file_name, 'wb') as f:
        for chunk in result.iter_content(chunk_size=1024):
            if chunk:
                f.write(chunk)


def create_period_list(year, weeks):
    period_list = []
    for week in weeks:
        period_list.append('%sW%s' % (year, week))
    return ",".join(period_list)


def get_month_from_int(value):
    months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    return months[value]


def generate_dates_to_now(start_year, start_month):
    current = datetime.now()
    dates_dict = {}

    for year in range(start_year, current.year + 1):
        dates_dict[year] = []

        for month in range(12, 0, -1):
            if year == start_year and month < start_month:
                continue

            if year == current.year and month > current.month:
                continue

            date_text = "%s'%s" % (get_month_from_int(month), str(year)[2:])
            if month < 10:
                date_value = '%s0%s' % (year, month)
            else:
                date_value = '%s%s' % (year, month)

            dates_dict[year].append({'value': date_value, 'text': date_text})

    return sorted(dates_dict.items(), key=operator.itemgetter(0), reverse=True)


def periods_in_ranges(start_period, end_period):
    start_year, start_month = int(start_period[0:4]), int(start_period[4:])
    end_year, end_month = int(end_period[0:4]), int(end_period[4:])
    periods = []

    for year in range (start_year, end_year+1):
        for month in range(1, 13):
            if year == start_year and month < start_month:
                continue

            if year == end_year and month > end_month:
                break

            if month < 10:
                periods.append('%s0%s' % (year, month))
            else:
                periods.append('%s%s' % (year, month))

    return periods