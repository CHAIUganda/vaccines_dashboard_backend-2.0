# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-03-15 09:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='district',
            options={'ordering': ('district_name',), 'verbose_name_plural': 'districts'},
        ),
        migrations.AddField(
            model_name='document',
            name='processed',
            field=models.BooleanField(default=False),
        ),
    ]
