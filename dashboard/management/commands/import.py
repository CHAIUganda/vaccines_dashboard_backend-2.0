import logging

import djclick as click

from dashboard.data.free_form_report import FreeFormReport
from dashboard.tasks import calculate_scores_for_checks_in_cycle

logger = logging.getLogger(__name__)


@click.command()
@click.argument('path')
@click.argument('cycle')
def command(path, cycle):
    click.secho('Importing {}'.format(path), fg='red')
    report = FreeFormReport(path, cycle).load()
    report.save()
    calculate_scores_for_checks_in_cycle(report)
