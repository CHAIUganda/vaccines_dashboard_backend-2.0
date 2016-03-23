from django.conf.urls import url
from api.views import district_list

urlpatterns = [
    url('^$', district_list, name='district_list'),
]
