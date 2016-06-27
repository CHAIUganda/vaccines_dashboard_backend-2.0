import logging

import djclick as click

from dashboard import *
from dashboard.data.stock_report import StockReport
from dashboard.tasks import import_stock_report

logger = logging.getLogger(__name__)


@click.command()
@click.argument('path')
@click.argument('year')
@click.argument('month')
def command(path, year, month):
    click.secho('Importing {}'.format(path), fg='red')
    import_stock_report(path, year, month)


