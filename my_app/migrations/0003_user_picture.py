# Generated by Django 5.1 on 2024-12-22 18:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_app', '0002_remove_task_user_alter_task_task_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='picture',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
