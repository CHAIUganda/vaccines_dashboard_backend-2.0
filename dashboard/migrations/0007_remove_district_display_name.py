# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-08-26 09:04
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0006_district_zone'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='district',
            name='display_name',
        ),
    ]
