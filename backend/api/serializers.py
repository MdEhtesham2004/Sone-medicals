from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note,Company, Medicine, AdminLogin, Customer, Bill, BillDetails, MedicineDetails, Employee, EmployeeSalary, CompanyAccount, CompanyBank, EmployeeBank, CustomerRequest
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
class CompanyBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyBank
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['company'] = CompanySerializer(instance.company).data
        return response
#done     
class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'
    
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['company'] = CompanySerializer(instance.company).data
        return response

#done 
class MedicineDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineDetails
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['medicine'] = MedicineSerializer(instance.medicine).data
        return response

class MedicineDetailsSerializerSimple(serializers.ModelSerializer):
    class Meta:
        model = MedicineDetails
        fields = '__all__'



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
    class Meta:
        model = Bill
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['customer'] = CustomerSerializer(instance.customer).data
        return response

class BillDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillDetails
        fields = '__all__'


#done 
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

#done 
class CompanyAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyAccount
        fields = '__all__'
    
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['company'] = CustomerSerializer(instance.customer).data
        return response


#done 
class EmployeeBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeBank
        fields = '__all__'

    
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['employee'] = EmployeeSerializer(instance.employee).data
        return response


#done 
class CustomerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerRequest
        fields = '__all__'
