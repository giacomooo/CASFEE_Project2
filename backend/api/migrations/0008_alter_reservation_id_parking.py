# Generated by Django 3.2.4 on 2022-01-04 16:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20210930_1352'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reservation',
            name='ID_Parking',
            field=models.ForeignKey(db_column='ID_Parking', on_delete=django.db.models.deletion.DO_NOTHING, related_name='Reservations', to='api.parking'),
        ),
    ]
