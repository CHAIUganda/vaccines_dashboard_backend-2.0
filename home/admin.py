from django.contrib import admin

from home.models import District, HSD, SubCounty, Parish, Document, Facility


class DistrictAdmin(admin.ModelAdmin):
    list_display = ('district_name',)


class HSDAdmin(admin.ModelAdmin):
    list_display = ('hsd_name', 'district')
    search_fields = ('hsd_name', 'district')
    ordering = ('hsd_name', 'district')
    list_filter = ('district',)


class SubCountyAdmin(admin.ModelAdmin):
    list_display = ('sub_county_name', 'hsd', 'district')
    search_fields = ('sub_county_name', 'hsd', 'district')
    ordering = ('sub_county_name', 'hsd', 'district')
    list_filter = ('district', 'hsd')


class ParishAdmin(admin.ModelAdmin):
    list_display = ('parish_name', 'sub_county', 'hsd', 'district')
    search_fields = ('sub_county', 'hsd', 'district')
    ordering = ('sub_county', 'hsd', 'district')
    list_filter = ('district', 'hsd', 'sub_county')


class FacilityAdmin(admin.ModelAdmin):
    list_display = (
        'facility_code', 'facility_name', 'facility_type', 'parish', 'get_sub_county', 'get_hsd', 'get_district',)
    search_fields = ('facility_code', 'facility_name', 'facility_type')
    ordering = ('facility_code', 'facility_name', 'facility_type')
    list_filter = ('facility_type', 'parish__sub_county', 'parish__hsd', 'parish__district')

    def get_district(self, obj):
        return obj.parish.district

    get_district.short_description = 'District'

    def get_sub_county(self, obj):
        return obj.parish.sub_county

    get_sub_county.short_description = 'SubCounty'

    def get_hsd(self, obj):
        return obj.parish.hsd

    get_hsd.short_description = 'HSD'


admin.site.register(District, DistrictAdmin)
admin.site.register(HSD, HSDAdmin)
admin.site.register(SubCounty, SubCountyAdmin)
admin.site.register(Parish, ParishAdmin)
admin.site.register(Document)
admin.site.register(Facility, FacilityAdmin)
