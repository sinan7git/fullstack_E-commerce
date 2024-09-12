# Generated by Django 3.2.6 on 2024-03-09 21:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('permissions', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='custompermission',
            name='codename',
            field=models.CharField(choices=[('can_manage_items', 'Can manage items'), ('can_manage_orders', 'Can manage orders')], max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='custompermission',
            name='name',
            field=models.CharField(choices=[('can_manage_items', 'Can manage items'), ('can_manage_orders', 'Can manage orders')], max_length=255),
        ),
    ]