import djclick as click

from dashboard.data.free_form_report import FreeFormReport
from dashboard.management.commands.manual_check import perform_checks
from dashboard.models import YearMonth
from dashboard.tasks import calculate_scores_for_checks_in_cycle


@click.command()
@click.argument('year_month')
def command(year_month):
    data = YearMonth.objects.filter(title=year_month)
    for year_month in data:
        report = FreeFormReport(None, year_month.title).build_form_db(year_month)
        calculate_scores_for_checks_in_cycle(report)
    # perform_checks()
