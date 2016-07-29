# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-07-27 17:44
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0002_auto_20160721_1859'),
    ]

    operations = [
        migrations.CreateModel(
            name='StockRequirement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year', models.IntegerField(default=2014)),
                ('minimum', models.IntegerField(default=0)),
                ('maximum', models.IntegerField(default=0)),
                ('district', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.District')),
                ('vaccine', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.Vaccine')),
            ],
        ),
        migrations.RemoveField(
            model_name='stock',
            name='consumed',
        ),
        migrations.AlterUniqueTogether(
            name='datavalue',
            unique_together=set([('facility', 'original_period', 'data_element', 'vaccine_category')]),
        ),
        migrations.AlterUniqueTogether(
            name='stockrequirement',
            unique_together=set([('district', 'vaccine', 'year')]),
        ),
    ]