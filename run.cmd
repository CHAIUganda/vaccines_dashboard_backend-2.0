@echo off
cd..
_mainenv\Scripts\activate
cd dashboard
python manage.py migrate
