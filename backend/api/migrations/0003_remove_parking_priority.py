# Generated by Django 3.2.4 on 2021-09-04 15:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_parking_table'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='parking',
            name='priority',
        ),
    ]
