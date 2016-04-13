from distutils.core import setup

setup(
    name='vaccines',
    version='1.0',
    packages=['qdbauth', 'qdbauth.tests', 'qdbauth.migrations', 'vaccines', 'dashboard', 'dashboard.data',
              'dashboard.data.tests', 'dashboard.tests', 'dashboard.tests.data_sources', 'dashboard.views',
              'dashboard.management', 'dashboard.management.commands', 'dashboard.templatetags'],
    url='http://127.0.0.1:8000/',
    license='',
    author='Malisa Ncube',
    author_email='inbox@malisancube.com',
    description='Vaccines Dashboard'
)
