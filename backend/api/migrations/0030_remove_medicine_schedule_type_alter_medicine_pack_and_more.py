# Generated by Django 5.2 on 2025-06-10 15:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0029_alter_customercreditdetailssuperate_medicine'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='medicine',
            name='schedule_type',
        ),
        migrations.AlterField(
            model_name='medicine',
            name='pack',
            field=models.CharField(max_length=100),
        ),
        migrations.CreateModel(
            name='CustomerCreditReact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('medicine_date', models.DateField(blank=True, null=True)),
                ('medicine_names', models.TextField()),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('payment_status', models.CharField(choices=[('Paid', 'Paid'), ('Pending', 'Pending')], default='Pending', max_length=20)),
                ('last_payment_date', models.DateField(blank=True, null=True)),
                ('last_payment_amount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('added_on', models.DateTimeField(auto_now_add=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.customercredit')),
            ],
        ),
    ]
