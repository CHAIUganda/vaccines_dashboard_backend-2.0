# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2017-04-20 09:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('planning', '0006_auto_20170420_1142'),
    ]

    operations = [
        migrations.RenameField(
            model_name='plannedactivities',
            old_name='Start',
            new_name='start',
        ),
        migrations.AlterField(
            model_name='plannedactivities',
            name='fund',
            field=models.BooleanField(default=False),
        ),
    ]