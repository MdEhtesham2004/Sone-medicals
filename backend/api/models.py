from django.db import models
from django.contrib.auth.models import User
# Create your models here.
from decimal import Decimal

class Note(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE,name="notes") 

    def __str__(self):
        return self.title
    

class AdminLogin(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(null=True, blank=True)
    added_on = models.DateTimeField(auto_now_add=True)


#done 
class Company(models.Model):
    name = models.CharField(max_length=100)
    license_no = models.CharField(max_length=100,null=True, blank=True)
    address = models.TextField()
    contact_no = models.CharField(max_length=15)
    added_on = models.DateTimeField(auto_now_add=True)
    gst_no = models.CharField(max_length=15, blank=True, null=True)
    bill_photo = models.ImageField(upload_to='company_bills/', blank=True, null=True)
    

#done 
class Medicine(models.Model):
    name = models.CharField(max_length=100)
    schedule_type = models.CharField(max_length=50) #" pass yes or no "
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    rate = models.DecimalField(max_digits=10, decimal_places=2)
    pack = models.IntegerField()    
    c_gst = models.DecimalField(max_digits=5, decimal_places=2,null=True, blank=True)
    s_gst = models.DecimalField(max_digits=5, decimal_places=2,null=True, blank=True)
    gst = models.DecimalField(max_digits=5, decimal_places=2,null=True, blank=True)
    amt_aftr_gst = models.DecimalField(max_digits=10, decimal_places=2,null=True, blank=True)
    batch_no = models.CharField(max_length=100)
    exp_date = models.DateField()
    mfg_date = models.DateField()
    company = models.ForeignKey(Company, on_delete=models.CASCADE,null=True, blank=True)
    qty_in_strip = models.IntegerField()
    added_on = models.DateTimeField(auto_now_add=True)

class Employee(models.Model):
    name = models.CharField(max_length=255)
    joining_date = models.DateField()
    phone = models.CharField(max_length=15)
    address = models.TextField()
    added_on = models.DateTimeField(auto_now_add=True)

class EmployeeSalary(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    salary_date = models.DateField()
    salary_amount = models.FloatField()
    added_on = models.DateTimeField(auto_now_add=True)

class EmployeeBank(models.Model):
    bank_account_no = models.CharField(max_length=50)
    ifsc = models.CharField(max_length=20)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)

class Customer(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    contact = models.CharField(max_length=15)
    added_on = models.DateTimeField(auto_now_add=True)


class Bill(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    added_on = models.DateTimeField(auto_now_add=True)

    def update_total(self):
        total = sum(detail.total_price for detail in self.billdetails_set.all())
        self.total_amount = total
        self.save()


class BillDetails(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    qty = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    added_on = models.DateTimeField(auto_now_add=True)


    def save(self, *args, **kwargs):
        self.total_price = Decimal(self.qty) * self.medicine.rate
        super().save(*args, **kwargs)
        self.bill.update_total()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self.bill.update_total()




class CustomerRequest(models.Model):
    """ this model is used to manage the customer request for medicine """
    customer_name = models.CharField(max_length=100)
    customer_address = models.TextField()
    customer_contact = models.CharField(max_length=15)
    # using image for prescription instead of using medicine as foreign key
    # optional field if anyone want to write the medicine name
    medicine_name = models.CharField(max_length=100, null=True, blank=True)
    # if one customer demands for more than one medicine then we can use this field
    medicine_list = models.TextField(null=True, blank=True) # list of medicine names
    prescription = models.ImageField(upload_to='prescriptions/', null=True, blank=True)
    request_status = models.CharField(max_length=20, choices=[
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected')
    ], default='Pending')
    requested_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.name} - {self.medicine_name}"
  




class MedicineStock(models.Model):
    """ this model is used to manage the medicine stock details """
    name = models.CharField(max_length=100, unique=True)
    schedule_type = models.CharField(max_length=50)
    in_stock_total = models.IntegerField(default=0)
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    rate = models.DecimalField(max_digits=10, decimal_places=2)  
    added_on = models.DateTimeField(auto_now_add=True)




class MedicineStockHistory(models.Model):
    """ this model is used to manage the medicine stock history IN?OUT"""
    medicine = models.ForeignKey(MedicineStock, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    transaction_type = models.CharField(max_length=10, choices=[('IN', 'In'), ('OUT', 'Out')])
    transaction_date = models.DateTimeField(auto_now_add=True)




class CustomerCredit(models.Model):
    """
    This model is used to manage customer credit details.
    such as customer name ,adress , contact , discription , payment status , amount , payment type , payment status will be common for every customer
    """
    # customer name ,adress , contact , discription , payment status , amount , payment type , payment status will be common for every customer 
    name = models.CharField(max_length=100)
    
    contact = models.CharField(max_length=15)

    record_type = models.CharField(max_length=100, choices=[('Delivery', 'Delivery'), ('Credit', 'Credit')] , default="Credit") #tells whether the record is for delivery or credit
    
    pending_amount = models.DecimalField(max_digits=10, decimal_places=2)
        
    last_payment_date = models.DateField(null=True, blank=True) # last payment date for the customer credit
    last_payment_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True,blank=True) # last payment date for the customer credit

    # adding a field to seperate the customer credit from the  delivery logic 
    # if the record is for delivery : 
    delivered_by = models.CharField(max_length=100, null=True, blank=True) # person who delivered the medicine
    # and medicine details will be in the customer credit details 
    added_on = models.DateTimeField(auto_now_add=True)
    # how to render in frontend 
    """ first check for the record type if it is delivery then show the delivered by field and take medicine  medicine details
    else if it is credit then show the customer details and take medicine details not need to render delivered by field 
    """



class CustomerCreditConnect(models.Model):
    """
    This model is used to connect customer credit with the customer credit details.
    """
    customer_credit = models.ForeignKey(CustomerCredit, on_delete=models.CASCADE)
    added_on = models.DateTimeField(auto_now_add=True)


class CustomerCreditDetails(models.Model):
    """ this model stores the customer credit deatails as well as the medicine details what he/she has taken 
    this 3 models works together
    CustomerCredit -> CustomerCreditConnect -> CustomerCreditDetails for managing CustomerCredit and Delivery Details 
    """
    customer_credit = models.ForeignKey(CustomerCreditConnect, on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    added_on = models.DateTimeField(auto_now_add=True)



class CustomerCreditDetailsSuperate(models.Model):
    """ this model is used to manage the customer credit details """
    customer_credit = models.ForeignKey(CustomerCredit, on_delete=models.CASCADE)
    medicine = models.ForeignKey(MedicineStock, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    added_on = models.DateTimeField(auto_now_add=True)