# Generated by Django 3.2.6 on 2024-03-10 14:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerce', '0003_user'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'permissions': (('can_manage_items', 'Can manage items'), ('can_manage_orders', 'Can manage orders'))},
        ),
    ]