# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2020-07-02 14:17
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('performance_management', '0006_auto_20200702_1707'),
    ]

    operations = [
        migrations.AddField(
            model_name='activity',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2020, 7, 2, 14, 17, 22, 947063, tzinfo=utc)),
            preserve_default=False,
        ),
    ]