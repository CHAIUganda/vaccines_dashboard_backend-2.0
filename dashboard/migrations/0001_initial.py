# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-07 02:19
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import jsonfield.fields
import picklefield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0007_alter_validators_add_error_messages'),
    ]

    operations = [
        migrations.CreateModel(
            name='DashboardUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('email', models.EmailField(db_index=True, max_length=255, unique=True, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('access_level', models.CharField(choices=[(b'Warehouse', b'Warehouse'), (b'District', b'District'), (b'IP', b'IP'), (b'MOH CENTRAL', b'MOH CENTRAL')], max_length=50)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
        ),
        migrations.CreateModel(
            name='AdultPatientsRecord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=256)),
                ('cycle', models.CharField(db_index=True, max_length=256)),
                ('district', models.CharField(db_index=True, max_length=256)),
                ('ip', models.CharField(db_index=True, max_length=256)),
                ('warehouse', models.CharField(db_index=True, max_length=256)),
                ('existing', models.FloatField(blank=True, null=True)),
                ('new', models.FloatField(blank=True, null=True)),
                ('formulation', models.CharField(blank=True, max_length=256, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Consumption',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=256)),
                ('cycle', models.CharField(db_index=True, max_length=256)),
                ('district', models.CharField(db_index=True, max_length=256)),
                ('ip', models.CharField(db_index=True, max_length=256)),
                ('warehouse', models.CharField(db_index=True, max_length=256)),
                ('opening_balance', models.FloatField(blank=True, null=True)),
                ('quantity_received', models.FloatField(blank=True, null=True)),
                ('pmtct_consumption', models.FloatField(blank=True, null=True)),
                ('art_consumption', models.FloatField(blank=True, null=True)),
                ('loses_adjustments', models.FloatField(blank=True, null=True)),
                ('closing_balance', models.FloatField(blank=True, null=True)),
                ('months_of_stock_of_hand', models.FloatField(blank=True, null=True)),
                ('quantity_required_for_current_patients', models.FloatField(blank=True, null=True)),
                ('estimated_number_of_new_patients', models.FloatField(blank=True, null=True)),
                ('estimated_number_of_new_pregnant_women', models.FloatField(blank=True, null=True)),
                ('packs_ordered', models.FloatField(blank=True, null=True)),
                ('notes', models.CharField(blank=True, max_length=256, null=True)),
                ('formulation', models.CharField(blank=True, db_index=True, max_length=256, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Cycle',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(db_index=True, max_length=256, unique=True)),
                ('state', picklefield.fields.PickledObjectField(editable=False)),
            ],
        ),
        migrations.CreateModel(
            name='CycleFormulationScore',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cycle', models.CharField(max_length=256)),
                ('test', models.CharField(max_length=256)),
                ('yes', models.FloatField(null=True)),
                ('no', models.FloatField(null=True)),
                ('not_reporting', models.FloatField(null=True)),
                ('combination', models.CharField(blank=True, max_length=256, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PAEDPatientsRecord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=256)),
                ('cycle', models.CharField(db_index=True, max_length=256)),
                ('district', models.CharField(db_index=True, max_length=256)),
                ('ip', models.CharField(db_index=True, max_length=256)),
                ('warehouse', models.CharField(db_index=True, max_length=256)),
                ('existing', models.FloatField(blank=True, null=True)),
                ('new', models.FloatField(blank=True, null=True)),
                ('formulation', models.CharField(blank=True, max_length=256, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Score',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=256)),
                ('cycle', models.CharField(db_index=True, max_length=256)),
                ('district', models.CharField(db_index=True, max_length=256)),
                ('ip', models.CharField(db_index=True, max_length=256)),
                ('warehouse', models.CharField(db_index=True, max_length=256)),
                ('REPORTING', jsonfield.fields.JSONField()),
                ('WEB_BASED', jsonfield.fields.JSONField()),
                ('MULTIPLE_ORDERS', jsonfield.fields.JSONField()),
                ('OrderFormFreeOfGaps', jsonfield.fields.JSONField()),
                ('guidelineAdherenceAdult1L', jsonfield.fields.JSONField()),
                ('guidelineAdherenceAdult2L', jsonfield.fields.JSONField()),
                ('guidelineAdherencePaed1L', jsonfield.fields.JSONField()),
                ('nnrtiNewPaed', jsonfield.fields.JSONField()),
                ('nnrtiCurrentPaed', jsonfield.fields.JSONField()),
                ('nnrtiNewAdults', jsonfield.fields.JSONField()),
                ('nnrtiCurrentAdults', jsonfield.fields.JSONField()),
                ('stablePatientVolumes', jsonfield.fields.JSONField()),
                ('consumptionAndPatients', jsonfield.fields.JSONField()),
                ('warehouseFulfilment', jsonfield.fields.JSONField()),
                ('differentOrdersOverTime', jsonfield.fields.JSONField()),
                ('closingBalanceMatchesOpeningBalance', jsonfield.fields.JSONField()),
                ('orderFormFreeOfNegativeNumbers', jsonfield.fields.JSONField()),
                ('stableConsumption', jsonfield.fields.JSONField()),
                ('pass_count', models.IntegerField()),
                ('fail_count', models.IntegerField()),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='score',
            unique_together=set([('name', 'cycle', 'district')]),
        ),
        migrations.AlterUniqueTogether(
            name='cycleformulationscore',
            unique_together=set([('cycle', 'combination', 'test')]),
        ),
        migrations.AddField(
            model_name='consumption',
            name='facility_cycle',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='consumption', to='dashboard.Cycle'),
        ),
    ]
