# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2020-03-09 12:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cold_chain', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='eligiblefacilitymetric',
            name='month',
            field=models.IntegerField(default=6),
        ),
        migrations.AddField(
            model_name='eligiblefacilitymetric',
            name='year',
            field=models.IntegerField(default=2019),
        ),
    ]
