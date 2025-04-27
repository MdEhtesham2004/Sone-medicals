

def create_stock_history_for_medicine(medicine, transaction_type='IN'):
    try:
        medicine_stock = MedicineStock.objects.get(name=medicine.name)
    except MedicineStock.DoesNotExist:
        medicine_stock = None

    if medicine_stock:
        MedicineStockHistory.objects.create(
            medicine=medicine_stock,
            quantity=medicine.qty_in_strip,
            transaction_type=transaction_type
        )
