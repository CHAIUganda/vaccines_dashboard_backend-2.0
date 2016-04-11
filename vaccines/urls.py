from django.conf.urls import include, url

from dashboard import urls as dashboard_urls
from dashboard.admin import admin_site
from qdbauth import urls as auth_urls

urlpatterns = [
    url(r'^admin/', include(admin_site.urls)),
    url(r'^', include(dashboard_urls)),
    url(r'^', include(auth_urls)),
    url(r'^', include('password_reset.urls'))
]
