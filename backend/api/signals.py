from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Medicine, MedicineStock


@receiver(post_save, sender=Medicine)
def create_or_update_unique_medicine(sender, instance, created, **kwargs):
    unique_medicine, is_created = MedicineStock.objects.get_or_create(
        name=instance.name,
        defaults={
            'schedule_type': instance.schedule_type,
            'in_stock_total': instance.qty_in_strip,
            'mrp': instance.mrp,
            'rate': instance.rate
        }
    )
    if not is_created:
        unique_medicine.in_stock_total += instance.qty_in_strip
        unique_medicine.mrp += instance.mrp
        unique_medicine.rate += instance.rate
        
        print("Received MRP:", instance.mrp, type(instance.mrp))
        print("Received Rate:", instance.rate, type(instance.rate))

        print("Saving MRP:", unique_medicine.mrp)
        print("Saving Rate:", unique_medicine.rate)

        unique_medicine.save()
    
    print(f"[Signal Triggered] Created: {created}, Medicine: {instance.name}")
    