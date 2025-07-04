from django.contrib.auth.models import User
from rest_framework import serializers
from .models import * 
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

#done 
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user 
    
#done 
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'author']
        extra_kwargs = {'author': {'read_only': True}}



#done 
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

#done     
class MedicineSerializer(serializers.ModelSerializer):
    company_details = CompanySerializer(source='company', read_only=True)  # 'company' is the ForeignKey field

    class Meta:
        model = Medicine
        fields = [
            'id', 'name', 'mrp', 'rate', 'pack', 
            'c_gst', 's_gst', 'batch_no', 'exp_date', 'mfg_date', 
            'company',  'qty_in_strip', 'gst',"amt_aftr_gst", 'added_on','company_details'
        ]
    def create(self, validated_data):
        rate = validated_data.get('rate', 0)
        gst = validated_data.get('gst', 0)
        sub_gst  = gst / 2 #cgst and sgst are equal
        amt_aftr_gst = rate + (rate * gst / 100)
        validated_data['amt_aftr_gst'] = round(amt_aftr_gst, 2)
        validated_data['c_gst'] = round(sub_gst, 2)
        validated_data['s_gst'] = round(sub_gst, 2)

        return super().create(validated_data)
   
class AdminLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminLogin
        fields = '__all__'

#done
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'




#done 
class BillSerializer(serializers.ModelSerializer):
    # customer = CustomerSerializer(read_only=True)
    # medicine = MedicineSerializer(read_only=True)

    class Meta:
        model = Bill
        fields = '__all__'
        # fields = ['id', 'customer','medicine', 'added_on']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['customer'] = CustomerSerializer(instance.customer).data
        return response

class BillDetailsSerializer(serializers.ModelSerializer):
    # bill = BillSerializer(read_only=True)
    # medicine = MedicineSerializer(read_only=True)
    class Meta:
        model = BillDetails
        # fields = ['id', 'bill', 'medicine', 'qty', 'added_on']
        fields = '__all__'
    
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['bill'] = BillSerializer(instance.bill).data
        response['medicine'] = MedicineSerializer(instance.medicine).data
        # response['customer'] = CustomerSerializer(instance.bill.customer).data
        return response    



#done 
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


#done 
class EmployeeBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeBank
        fields = '__all__'

    
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['employee'] = EmployeeSerializer(instance.employee).data
        return response


# #done 
# class CustomerRequestSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomerRequest
#         fields = '__all__'





class MedicineStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineStock
        fields = ['id', 'name', 'schedule_type', 'in_stock_total', 'mrp', 'rate']


    @property 
    def low_stock(self):
        pass 


class MedicineStockHistorySerializer(serializers.ModelSerializer):
    # Using the MedicineStockSerializer to represent the 'medicine' field
    medicine = MedicineStockSerializer(read_only=True)

    class Meta:
        model = MedicineStockHistory
        fields = "__all__"

    def to_representation(self, instance):
        # We can keep this as it is, because the medicine field is already serialized using MedicineStockSerializer
        response = super().to_representation(instance)
        return response



class CustomerCreditSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerCredit
        fields = '__all__'



class CustomerCreditDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerCreditDetails
        fields = '__all__'

        
class CustomerCreditPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerCreditPaymentDetails
        fields = '__all__'


class LowStockAlertSerializer(serializers.ModelSerializer):    
    class Meta:
        model = LowStockAlert
        fields = '__all__'

from datetime import date

class ExpiryMedicineSerializer(serializers.ModelSerializer):
    expiry_status = serializers.SerializerMethodField()

    class Meta:
        model = ExpiryMedicine
        fields = '__all__'
        extra_fields = ['expiry_status']  # optional

    def get_expiry_status(self, obj):
        today = date.today()
        remaining_days = (obj.exp_date - today).days

        if remaining_days > 90:
            return f"Expires in more than 3 months"
        elif 0 < remaining_days <= 90:
            return f"Expires in {remaining_days} days"
        elif remaining_days == 0:
            return "Expires today"
        else:
            return "Expired"

