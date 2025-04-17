from django.db import models
from django.contrib.auth.models import User
# Create your models here.


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

class Company(models.Model):
    name = models.CharField(max_length=100)
    license_no = models.CharField(max_length=100)
    address = models.TextField()
    contact_no = models.CharField(max_length=15)
    description = models.TextField(blank=True)
    added_on = models.DateTimeField(auto_now_add=True)
    gst_no = models.CharField(max_length=15, blank=True, null=True)
    # invoice_no = models.CharField(max_length=15, blank=True, null=True)
    # invoice_date = models.DateField(blank=True, null=True)
    

class Medicine(models.Model):
    name = models.CharField(max_length=100)
    medical_type = models.CharField(max_length=50)
    buy_price = models.DecimalField(max_digits=10, decimal_places=2)
    sell_price = models.DecimalField(max_digits=10, decimal_places=2)
    c_gst = models.DecimalField(max_digits=5, decimal_places=2)
    s_gst = models.DecimalField(max_digits=5, decimal_places=2)
    batch_no = models.CharField(max_length=100)
    shelf_no = models.CharField(max_length=100)
    exp_date = models.DateField()
    mfg_date = models.DateField()
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    in_stock_total = models.IntegerField()
    qty_in_strip = models.IntegerField()
    added_on = models.DateTimeField(auto_now_add=True)

class MedicineDetails(models.Model):
    medicine = models.ForeignKey('Medicine', on_delete=models.CASCADE)
    salt_name = models.CharField(max_length=255)
    salt_qty_type = models.CharField(max_length=100)
    description = models.TextField()
    added_on = models.DateTimeField(auto_now_add=True)


class CompanyAccount(models.Model):
    company = models.ForeignKey('Company', on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=100)
    transaction_amt = models.FloatField()
    transaction_date = models.DateField()
    payment_mode = models.CharField(max_length=100)

class CompanyBank(models.Model):
    id = models.AutoField(primary_key=True)
    bank_account_no = models.CharField(max_length=50)
    ifsc = models.CharField(max_length=20)
    company = models.ForeignKey('Company', on_delete=models.CASCADE)
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

class CustomerRequest(models.Model):
    customer_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    medicine_details = models.TextField()
    status = models.CharField(max_length=100)
    request_date = models.DateTimeField(auto_now_add=True)


class Bill(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    added_on = models.DateTimeField(auto_now_add=True)

class BillDetails(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    qty = models.IntegerField()
    added_on = models.DateTimeField(auto_now_add=True)
