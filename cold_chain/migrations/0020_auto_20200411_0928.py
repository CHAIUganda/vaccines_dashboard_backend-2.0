# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2020-04-11 06:28
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cold_chain', '0019_auto_20200411_0926'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='activity_cost_ugx',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='activity',
            name='activity_cost_usd',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='activity',
            name='budget_assumption',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AlterField(
            model_name='activity',
            name='funding_status',
            field=models.CharField(blank=True, choices=[('Funded', 'Funded'), ('Not Funded', 'Not Funded')], default='Funded', max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='activity',
            name='immunization_component',
            field=models.CharField(blank=True, choices=[('Advocacy', 'Advocacy, Communication & Social Mobilization'), ('Monitoring', 'Monitoring, Supervision & Evaluation'), ('ProgrammeManagementGeneral', 'Programme Management General'), ('ProgrammeManagementFinance', 'Programme Management Finance'), ('ServiceDelivery', 'Service Delivery & Training'), ('Surveillance', 'Surveillance'), ('Vaccines', 'Vaccines, Logistics, Equipment & Infrastructure')], default='Advocacy', max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='activity',
            name='level',
            field=models.CharField(blank=True, choices=[('District', 'District'), ('National', 'National')], default='District', max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='activity',
            name='objective',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AlterField(
            model_name='activity',
            name='organization',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='cold_chain.Organization'),
        ),
        migrations.AlterField(
            model_name='activity',
            name='responsible_focal_point',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AlterField(
            model_name='activity',
            name='stackholder_focal_point',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AlterField(
            model_name='activity',
            name='verification',
            field=models.CharField(blank=True, default='', max_length=1000, null=True),
        ),
    ]
