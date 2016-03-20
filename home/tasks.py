from celery.decorators import task
from celery.utils.log import get_task_logger
from celery.task.schedules import crontab

from celery.decorators import periodic_task
from celery.utils.log import get_task_logger

from home.models import Document

import pandas as pd

logger = get_task_logger(__name__)

@periodic_task(
    run_every=(crontab(minute='*/2')),
    name="process_excel_file",
    ignore_result=True
)
#@task(name="process_excel_file")
def process_excel_file():
    logger.warn("parse_workbook: Task running... ")
    documents = Document.objects.filter(processed=False)
    for document in documents:
        if document.document_type == '1':
            process_facilities(document)
        elif document.document_type == '2':
            process_coverage(document)
        else:
            process_balances(document)


def process_facilities(document):
    print("District balances and orders")
    xls = pd.ExcelFile(document.path)
    df = xls.parse('Sheet2', header=0, skiprows=1)
    print(df.head())
    print(df.columns)


    #df = pd.read_excel(document.path, sheetname=0, skiprows=1, na_values=['NA'], header=1)
    #print('-------- headings---------')
    #print(df.head())
    # print('-------- columns---------')
    # print(df.columns)
    # for i in df.index:
    #      print(df['MEASLES'][i])
    # document.processed=True
    # document.save()


def process_coverage(document):
    logger.info("Processing:" + document.path)
    print("process_coverage")


def process_balances(document):
    logger.info("Processing:" + document.path)
    print("process_balances")



class switch(object):
    value = None
    def __new__(class_, value):
        class_.value = value
        return True

def case(*args):
    return any((arg == switch.value for arg in args))