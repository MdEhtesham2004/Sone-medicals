from django.contrib import admin

# Register your models here.
from . views import Company, Medicine, AdminLogin, Customer, Bill, BillDetails

from django.contrib import admin
admin.site.register(Company)
admin.site.register(Medicine)
admin.site.register(AdminLogin)
admin.site.register(Customer)
admin.site.register(Bill)
admin.site.register(BillDetails)
