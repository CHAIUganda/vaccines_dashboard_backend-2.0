#! /bin/sh
set -e
coverage run --branch --source=dashboard,vaccines,qdbauth,locations ./manage.py test --with-timer
coverage report
coverage html -d reports/coverage
