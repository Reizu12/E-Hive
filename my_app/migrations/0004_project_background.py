# Generated by Django 5.1 on 2024-12-24 11:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_app', '0003_user_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='background',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]