# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-08-24 09:21
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0005_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='district',
            name='zone',
            field=models.SmallIntegerField(blank=True, null=True),
        ),
    ]
