import logging

import djclick as click

from dashboard.data.free_form_report import FreeFormReport
from dashboard.tasks import calculate_totals_in_month

logger = logging.getLogger(__name__)


@click.command()
@click.argument('path')
@click.argument('year_month')
def command(path, year_month):
    click.secho('Importing {}'.format(path), fg='red')
    report = FreeFormReport(path, year_month).load()
    report.save()
    calculate_totals_in_month(report)
