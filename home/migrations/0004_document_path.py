# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0003_auto_20160316_2055'),
    ]

    operations = [
        migrations.AddField(
            model_name='document',
            name='path',
            field=models.CharField(max_length=255, default='c:\\Dev\\Python\\dashboard\\media\\documents\x816\x03\x0e\\District_balances_and_orders_0YEoCCE.xlsx'),
            preserve_default=False,
        ),
    ]
