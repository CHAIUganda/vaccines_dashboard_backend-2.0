# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2017-02-24 08:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coverage', '0009_vaccinedose_planned_consumption'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vaccinedose',
            name='drop_out_rate',
            field=models.FloatField(blank=True, null=True),
        ),
    ]