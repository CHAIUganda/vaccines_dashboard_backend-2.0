from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns

from api.views import DistrictList, VaccinesList

urlpatterns = [
   url(r'^districts/$', DistrictList.as_view()),
   url(r'^vaccines/$', VaccinesList.as_view()),
   url(r'^facilities/$', VaccinesList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)