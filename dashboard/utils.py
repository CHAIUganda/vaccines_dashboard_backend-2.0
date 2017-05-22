import os
import requests
from vaccines.settings import DHIS2_USER, DHIS2_PASS, DHIS2_ADDRESS, BASE_DIR


def get_data_set_file_path(data_set_identifier, period):
    # return "D:\vaccines\data_set_%s_%s.json" % (data_set.identifier, period)
    #return "%s\\downloads\\data_set_%s_%s.json" % (BASE_DIR, data_set_identifier, period)

    return os.path.join(BASE_DIR, 'downloads', "data_set_%s_%s.json" % (data_set_identifier, period))

def dhis2_request(resource):
    url = '%s/hmis2/api/%s' % (DHIS2_ADDRESS,resource)
    result = requests.get(url, auth=(DHIS2_USER, DHIS2_PASS))
    return result.json()


def dhis2_request_to_file(resource, file_name):
    url = '%s/hmis2/api/%s' % (DHIS2_ADDRESS,resource)
    print 'Fetching [%s]' % url
    result = requests.get(url, auth=(DHIS2_USER, DHIS2_PASS), stream=True, verify=False)

    with open(file_name, 'wb') as f:
        for chunk in result.iter_content(chunk_size=1024):
            if chunk:
                f.write(chunk)
