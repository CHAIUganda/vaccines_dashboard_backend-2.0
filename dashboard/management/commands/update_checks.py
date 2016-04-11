import djclick as click

from dashboard.data.free_form_report import FreeFormReport
from dashboard.management.commands.manual_check import perform_checks
from dashboard.models import Cycle
from dashboard.tasks import calculate_scores_for_checks_in_cycle


@click.command()
@click.argument('cycle')
def command(cycle):
    data = Cycle.objects.filter(title=cycle)
    for cycle in data:
        report = FreeFormReport(None, cycle.title).build_form_db(cycle)
        calculate_scores_for_checks_in_cycle(report)
    # perform_checks()
