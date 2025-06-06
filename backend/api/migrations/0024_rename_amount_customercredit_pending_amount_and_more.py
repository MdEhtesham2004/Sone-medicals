# Generated by Django 5.2 on 2025-05-20 10:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_customerrequest'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customercredit',
            old_name='amount',
            new_name='pending_amount',
        ),
        migrations.RemoveField(
            model_name='customercredit',
            name='description',
        ),
        migrations.AddField(
            model_name='customercredit',
            name='last_payment_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
