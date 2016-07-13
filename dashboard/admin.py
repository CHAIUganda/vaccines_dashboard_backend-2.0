from admirarchy.utils import HierarchicalModelAdmin
from custom_user.forms import EmailUserChangeForm, EmailUserCreationForm
from django.contrib.admin import AdminSite, ModelAdmin
from django.contrib.auth.admin import GroupAdmin, UserAdmin
from django.contrib.auth.models import Group
from django.utils.translation import ugettext_lazy
from django.utils.translation import ugettext_lazy as _

from dashboard.data.stock_report import StockReport
from dashboard.models import DashboardUser, YearMonth, Stock
# from dashboard.tasks import calculate_totals_in_month


class EmailUserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser',
                       'groups', 'user_permissions')
            }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = ((
                         None, {
                             'classes': ('wide',),
                             'fields': ('email', 'password1', 'password2')
                         }
                     ),
    )

    form = EmailUserChangeForm
    add_form = EmailUserCreationForm

    list_display = ('email', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)


class QdbSite(AdminSite):
    site_title = ugettext_lazy('Vaccines admin')

    site_header = ugettext_lazy('Vaccines administration')

    index_title = ugettext_lazy('Vaccines administration')


def run_tests(model_admin, request, queryset):
    data = queryset.all()
    for year_month in data:
        report = StockReport(None, year_month.title).build_form_db(year_month)
        calculate_totals_in_month.delay(report)


run_tests.short_description = "Run quality tests for these cycles"


class StockAdmin(ModelAdmin):
    search_fields = ('district','month', "year", "month", "vaccine")
    list_display = ('district', 'year', 'month', 'vaccine',)
    list_filter = ('district', 'year', 'month', 'vaccine',)


class CycleAdmin(ModelAdmin):
    actions = [run_tests]


admin_site = QdbSite()
admin_site.register(Group, GroupAdmin)
admin_site.register(DashboardUser, EmailUserAdmin)
admin_site.register(Stock, StockAdmin)
admin_site.register(YearMonth, CycleAdmin)
