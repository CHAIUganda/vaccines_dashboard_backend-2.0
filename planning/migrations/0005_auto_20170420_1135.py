# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2017-04-20 08:35
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('planning', '0004_auto_20170420_1130'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plannedactivities',
            name='fund',
            field=models.BooleanField(),
        ),
    ]