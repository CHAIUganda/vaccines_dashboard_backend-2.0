# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-11-01 06:36
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('dashboard', '0013_remove_facility_type'),
        ('coverage', '0004_delete_dhis2coverage'),
    ]

    operations = [
        migrations.CreateModel(
            name='DHIS2VaccineDoseDataset',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('period', models.IntegerField()),
                ('dose', models.CharField(max_length=255)),
                ('consumed', models.FloatField(default=0)),
                ('planned_consumption', models.FloatField(default=0)),
                ('district', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.District')),
                ('vaccine', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.Vaccine')),
            ],
        ),
        migrations.CreateModel(
            name='VaccineDose',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('period', models.IntegerField()),
                ('drop_out_rate', models.FloatField(default=0)),
                ('under_immunized', models.FloatField(default=0)),
                ('district', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.District')),
                ('vaccine', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.Vaccine')),
            ],
        ),
    ]