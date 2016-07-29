# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-07-13 11:16
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0003_stock_ordered'),
    ]

    operations = [
        migrations.CreateModel(
            name='CategoryOptionCombo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identifier', models.CharField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('age_group', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='DataElement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identifier', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('data_set_identifier', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='DataSet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identifier', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('period_type', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='DataSyncTracker',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('period', models.IntegerField(unique=True)),
                ('last_downloaded', models.DateTimeField(default=django.utils.timezone.now)),
                ('last_parsed', models.DateTimeField(default=django.utils.timezone.now)),
                ('status', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='DataValue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('period', models.IntegerField()),
                ('original_period', models.CharField(max_length=20)),
                ('value', models.IntegerField()),
                ('category_option_combo', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.CategoryOptionCombo')),
                ('data_element', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.DataElement')),
                ('data_set', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.DataSet')),
            ],
        ),
        migrations.CreateModel(
            name='District',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identifier', models.CharField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Facility',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identifier', models.CharField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Region',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identifier', models.CharField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SubCounty',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identifier', models.CharField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('district', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.District')),
            ],
        ),
        migrations.DeleteModel(
            name='YearMonth',
        ),
        migrations.AlterUniqueTogether(
            name='stock',
            unique_together=set([('district', 'vaccine', 'year', 'month')]),
        ),
        migrations.AddField(
            model_name='facility',
            name='sub_county',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.SubCounty'),
        ),
        migrations.AddField(
            model_name='district',
            name='region',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.Region'),
        ),
        migrations.AddField(
            model_name='datavalue',
            name='district',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.District'),
        ),
        migrations.AddField(
            model_name='datavalue',
            name='facility',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.Facility'),
        ),
        migrations.AddField(
            model_name='datavalue',
            name='region',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.Region'),
        ),
        migrations.AddField(
            model_name='categoryoptioncombo',
            name='data_element',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.DataElement'),
        ),
        migrations.AlterUniqueTogether(
            name='datavalue',
            unique_together=set([('facility', 'original_period', 'data_element', 'category_option_combo')]),
        ),
    ]