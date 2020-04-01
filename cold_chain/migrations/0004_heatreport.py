# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2020-03-31 13:50
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0001_initial'),
        ('cold_chain', '0003_eligiblefacilitymetric_cce_coverage_rate'),
    ]

    operations = [
        migrations.CreateModel(
            name='HeatReport',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('heat_alarm', models.IntegerField(default=0)),
                ('cold_alarm', models.IntegerField(default=0)),
                ('year', models.IntegerField(default=2019)),
                ('month', models.IntegerField(default=1)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('district', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.District')),
                ('refrigerator_detail', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='cold_chain.RefrigeratorDetail')),
            ],
        ),
    ]