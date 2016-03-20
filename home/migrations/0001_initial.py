# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-03-14 09:00
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='District',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('district_name', models.CharField(max_length=70)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'home',
                'db_table': 'district',
                'ordering': ('district_name',),
            },
        ),
        migrations.CreateModel(
            name='DistrictBalance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year', models.IntegerField()),
                ('month', models.IntegerField()),
                ('dose', models.DecimalField(decimal_places=2, max_digits=18)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('district', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.District')),
            ],
            options={
                'verbose_name_plural': 'district_balances',
                'db_table': 'district_balance',
            },
        ),
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('month', models.IntegerField()),
                ('filename', models.CharField(max_length=70)),
                ('document_type', models.CharField(choices=[('1', 'TBL_FACILITIES'), ('2', 'COVERAGE'), ('3', 'DISTRICT BALANCES AND ORDERS')], max_length=1)),
                ('data', models.FileField(upload_to='documents/%Y/%m/%d')),
                ('date_created', models.DateField(auto_now_add=True)),
            ],
            options={
                'verbose_name_plural': 'file_uploads',
                'db_table': 'file_upload',
            },
        ),
        migrations.CreateModel(
            name='Facility',
            fields=[
                ('facility_code', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('facility_name', models.CharField(max_length=70)),
                ('facility_type', models.CharField(choices=[('1', 'DISTRICT STORE'), ('2', 'SUB-DISTRICT STORE'), ('3', 'NGO HCI'), ('4', 'NGO HCII'), ('5', 'NGO HCIV'), ('6', 'PUBLIC HCI'), ('7', 'PUBLIC HCII'), ('8', 'PUBLIC HCIII'), ('9', 'NGO HOSPITAL'), ('10', 'PUBLIC HOSPITAL')], max_length=1)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'facilities',
                'db_table': 'facility',
            },
        ),
        migrations.CreateModel(
            name='HSD',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hsd_name', models.CharField(max_length=70)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('district', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.District')),
            ],
            options={
                'verbose_name_plural': 'hsds',
                'db_table': 'hsd',
                'ordering': ('hsd_name',),
            },
        ),
        migrations.CreateModel(
            name='Parish',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parish_name', models.CharField(max_length=70)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('district', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.District')),
                ('hsd', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.HSD')),
            ],
            options={
                'verbose_name_plural': 'parishes',
                'db_table': 'parish',
            },
        ),
        migrations.CreateModel(
            name='SubCounty',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sub_county_name', models.CharField(max_length=70)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('district', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.District')),
                ('hsd', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.HSD')),
            ],
            options={
                'verbose_name_plural': 'subcounties',
                'db_table': 'subcounty',
            },
        ),
        migrations.CreateModel(
            name='Vaccine',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vaccine_name', models.CharField(max_length=70)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'vaccines',
                'db_table': 'vaccine',
            },
        ),
        migrations.AddField(
            model_name='parish',
            name='sub_county',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.SubCounty'),
        ),
        migrations.AddField(
            model_name='facility',
            name='parish',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.Parish'),
        ),
        migrations.AddField(
            model_name='districtbalance',
            name='vaccine',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.Vaccine'),
        ),
    ]
