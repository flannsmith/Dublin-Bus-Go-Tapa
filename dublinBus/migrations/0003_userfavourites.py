# Generated by Django 2.0.6 on 2018-07-31 12:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dublinBus', '0002_event'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserFavourites',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.CharField(max_length=20)),
                ('location_address', models.CharField(max_length=100)),
                ('location_name', models.CharField(max_length=20)),
            ],
        ),
    ]
