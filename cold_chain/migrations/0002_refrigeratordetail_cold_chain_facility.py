# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2020-09-01 07:34
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cold_chain', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='refrigeratordetail',
            name='cold_chain_facility',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='cold_chain.ColdChainFacility'),
        ),
    ]
