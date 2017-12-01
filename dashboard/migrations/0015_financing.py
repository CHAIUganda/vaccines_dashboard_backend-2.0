# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2017-11-13 12:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0014_stockrequirement_coverage_target'),
    ]

    operations = [
        migrations.CreateModel(
            name='Financing',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('period', models.IntegerField(unique=True)),
                ('gavi_approved', models.BigIntegerField(default=0)),
                ('gavi_disbursed', models.BigIntegerField(default=0)),
                ('gou_approved', models.BigIntegerField(default=0)),
                ('gou_disbursed', models.BigIntegerField(default=0)),
            ],
        ),
    ]