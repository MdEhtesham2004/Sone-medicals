# Generated by Django 5.2 on 2025-04-22 13:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_rename_buy_price_medicine_mrp_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='companybank',
            name='company',
        ),
        migrations.DeleteModel(
            name='CompanyAccount',
        ),
        migrations.DeleteModel(
            name='CompanyBank',
        ),
    ]
