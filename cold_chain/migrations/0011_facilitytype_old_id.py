# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2017-02-09 12:41
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cold_chain', '0010_remove_facilitytype_old_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='facilitytype',
            name='old_id',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
