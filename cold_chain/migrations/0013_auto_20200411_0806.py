# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2020-04-11 05:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cold_chain', '0012_auto_20200409_1711'),
    ]

    operations = [
        migrations.AddField(
            model_name='activity',
            name='activity_cost_ugx',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='activity',
            name='activity_cost_usd',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='activity',
            name='budget_assumption',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='activity',
            name='responsible_focal_point',
            field=models.CharField(default='', max_length=300),
        ),
        migrations.AddField(
            model_name='activity',
            name='stackholder_focal_point',
            field=models.CharField(default='', max_length=300),
        ),
    ]