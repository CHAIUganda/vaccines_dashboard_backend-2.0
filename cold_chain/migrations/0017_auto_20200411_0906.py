# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2020-04-11 06:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cold_chain', '0016_auto_20200411_0903'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='name',
            field=models.TextField(unique=True),
        ),
    ]
