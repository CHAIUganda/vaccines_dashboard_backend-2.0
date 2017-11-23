# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2017-11-20 10:55
from __future__ import unicode_literals

import django.core.files.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0016_datauploadlog'),
    ]

    operations = [
        migrations.AddField(
            model_name='datauploadlog',
            name='data_file',
            field=models.FileField(default=None, storage=django.core.files.storage.FileSystemStorage(location=b'/tmp'), upload_to=b''),
        ),
    ]
