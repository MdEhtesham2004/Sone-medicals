# Generated by Django 5.2 on 2025-04-27 13:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_customercredit_customercreditdetails'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customercredit',
            name='medicine',
        ),
        migrations.CreateModel(
            name='CustomerCreditConnect',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('added_on', models.DateTimeField(auto_now_add=True)),
                ('customer_credit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.customercredit')),
            ],
        ),
        migrations.AlterField(
            model_name='customercreditdetails',
            name='customer_credit',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.customercreditconnect'),
        ),
    ]
