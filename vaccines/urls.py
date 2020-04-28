from django.conf.urls import include, url

from dashboard import urls as dashboard_urls
from dashboard.admin import admin_site
from qdbauth import urls as auth_urls
from cold_chain import urls as cold_chain_urls
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    url(r'^admin/', include(admin_site.urls)),
    url(r'^coldchain/', include('cold_chain.urls')),
    url(r'^coverage/', include('coverage.urls')),
    url(r'^planning/', include('planning.urls')),
    url(r'^unepi/', include('unepi.urls')),
    url(r'^performance_management/', include('performance_management.urls')),
    url(r'^', include(dashboard_urls)),
    url(r'^', include(auth_urls)),
    url(r'^', include('password_reset.urls')),
    url(r'^auth/', include('djoser.urls.base')),
    url(r'^auth/', include('djoser.urls.authtoken')),
]

urlpatterns += staticfiles_urlpatterns()