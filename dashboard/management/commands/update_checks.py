import djclick as click

from dashboard.data.free_form_report import StockReport
from dashboard.management.commands.manual_check import perform_checks
from dashboard.models import YearMonth
from dashboard.tasks import calculate_totals_in_month


@click.command()
@click.argument('year_month')
def command(year_month):
    data = YearMonth.objects.filter(title=year_month)
    for year_month in data:
        report = StockReport(None, year_month.title).build_form_db(year_month)
        calculate_totals_in_month(report)
    # perform_checks()
