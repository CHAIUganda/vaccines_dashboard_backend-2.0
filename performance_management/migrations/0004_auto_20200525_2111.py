# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2020-05-25 18:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('performance_management', '0003_activity_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='activity',
            name='funding_state',
            field=models.CharField(blank=True, choices=[('Funded', 'Funded'), ('Unfunded', 'Unfunded')], default='Funded', max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='activity',
            name='funding_status',
            field=models.CharField(blank=True, choices=[('Secured', 'Secured'), ('Unsecured', 'Unsecured')], default='Secured', max_length=200, null=True),
        ),
    ]