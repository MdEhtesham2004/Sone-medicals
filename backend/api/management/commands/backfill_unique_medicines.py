from django.core.management.base import BaseCommand
from api.models import Medicine, MedicineStock




print("running the management script......")
class Command(BaseCommand):
    help = 'Backfill MedicineStock table from existing Medicine records'

    def handle(self, *args, **kwargs):
        medicines = Medicine.objects.all()
        for med in medicines:
            unique_medicine, created = MedicineStock.objects.get_or_create(
                name=med.name,
                defaults={
                    'schedule_type': med.schedule_type,
                    'in_stock_total': med.qty_in_strip,
                    "mrp": med.mrp,
                    "rate": med.rate,
                }
            )
            if not created:
                unique_medicine.in_stock_total += med.qty_in_strip
                unique_medicine.mrp += med.mrp
                unique_medicine.rate += med.rate
                unique_medicine.save()
        self.stdout.write(self.style.SUCCESS('✅ Backfill completed!'))