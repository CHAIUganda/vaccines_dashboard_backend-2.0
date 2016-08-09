from admirarchy.utils import HierarchicalModelAdmin
from custom_user.forms import EmailUserChangeForm, EmailUserCreationForm
from django.contrib.admin import AdminSite, ModelAdmin
from django.contrib.auth.admin import GroupAdmin, UserAdmin
from django.contrib.auth.models import Group
from django.utils.translation import ugettext_lazy
from django.utils.translation import ugettext_lazy as _

from dashboard.models import *
from django.contrib import admin


class QdbSite(AdminSite):
    site_title = ugettext_lazy('Vaccines admin')

    site_header = ugettext_lazy('Vaccines administration')

    index_title = ugettext_lazy('Vaccines administration')


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


class StockRequirementAdmin(admin.ModelAdmin):
    search_fields = ('district', 'vaccine', 'year')
    list_display = ('district', 'vaccine', 'year', 'minimum', 'maximum')
    list_filter = ('district', 'vaccine', 'year')


class StockAdmin(admin.ModelAdmin):
    search_fields = ('stock_requirement', 'month')
    list_display = ('stock_requirement', 'month', 'at_hand', 'ordered')
    list_filter = ('stock_requirement', 'month')


class DataElementAdmin(admin.ModelAdmin):
    list_display = ('name', 'identifier')


class DataSetAdmin(admin.ModelAdmin):
    list_display = ('name', 'identifier')


class DistrictAdmin(admin.ModelAdmin):
    list_display = ('name', 'region')


class SubCountyAdmin(admin.ModelAdmin):
    list_display = ('name', 'district')


class FacilityAdmin(admin.ModelAdmin):
    list_display = ('name', 'sub_county')


class VaccineAdmin(admin.ModelAdmin):
    list_display = ('name', 'index')


class VaccineCategoryAdmin(admin.ModelAdmin):
    list_display = ('vaccine', 'data_element')
    search_fields = ('vaccine', 'data_element', 'vaccine__index')
    list_filter = ('vaccine', 'vaccine__index')



class DataSyncTrackerAdmin(admin.ModelAdmin):
    list_display = ('period', 'last_downloaded', 'last_parsed', 'get_status')

    def get_status(self, obj):
        if obj.status == DataSyncTrackerStatus.UNKNOWN:
            return 'Unknown'
        elif obj.status == DataSyncTrackerStatus.INIT_PARSE:
            return 'Initial Parse'
        elif obj.status == DataSyncTrackerStatus.INIT_DOWNLOAD:
            return 'Initial Download'
        elif obj.status == DataSyncTrackerStatus.PARSED:
            return 'Parsed'
        elif obj.status == DataSyncTrackerStatus.DOWNLOADED:
            return 'Downloaded'
        else:
            return 'N/A'


admin_site = QdbSite()
admin_site.register(Group, GroupAdmin)
admin_site.register(DashboardUser, EmailUserAdmin)
admin_site.register(StockRequirement, StockRequirementAdmin)
admin_site.register(Stock, StockAdmin)
admin_site.register(DataSet, DataSetAdmin)
admin_site.register(DataElement, DataElementAdmin)
admin_site.register(Region)
admin_site.register(District, DistrictAdmin)
admin_site.register(SubCounty, SubCountyAdmin)
admin_site.register(Vaccine, VaccineAdmin)
admin_site.register(VaccineCategory, VaccineCategoryAdmin)
admin_site.register(Facility, FacilityAdmin)
admin_site.register(DataSyncTracker, DataSyncTrackerAdmin)

