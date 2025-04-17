from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,AllowAny
from .serializers import UserSerializer,NoteSerializer
from .models import Note
from rest_framework import viewsets
from .models import Company, Medicine, AdminLogin, Customer, Bill, CompanyBank
from .serializers import *

#done 
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Allow any user to create an account
# Create your views here.

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view


    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)  # Save the author as the current user
        else:
            print(serializer.errors)
#done 
class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)  # Only allow the user to delete their own notes
    
class AdminLoginViewSet(viewsets.ModelViewSet):
    queryset = AdminLogin.objects.all()
    serializer_class = AdminLoginSerializer


from rest_framework.response import Response
from django.shortcuts import get_object_or_404

#done 
class CompanyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

    def list(self,request):
        company = Company.objects.all()
        serializer = CompanySerializer(company,many=True,context={'request':request})
        response_dict = {
            'error':False,
            'message':'All Company List Data',
            'data':serializer.data
        }
        return Response(response_dict)
    
    def create(self, request):
        serializer = CompanySerializer(data=request.data,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            response_dict = {
                'error': False,
                'message': 'Company Data Saved Successfully'
            }
        else:
            response_dict = {
                'error': True,
                'message': 'Error in Saving Company Data'
            }
        return Response(response_dict)
    
    def update(self,request,pk=None):
        
        queryset = Company.objects.get(id=pk)
        company = get_object_or_404(Company, id=pk)
        if not company:
            return Response({'error': 'Company not found'}, status=404)
        
        serializer = CompanySerializer(company,data=request.data,context={'request':request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response_dict = {
                'error': False,
                'message': 'Company Data Updated Successfully'
            }
        else:
            response_dict = {
                'error': True,
                'message': 'Error in Updating Company Data'
            }
        return Response(response_dict)    
company_list = CompanyViewSet.as_view({'get':'list'})
company_create = CompanyViewSet.as_view({'post':'create'})
company_update = CompanyViewSet.as_view({'put':'update'})
company_delete = CompanyViewSet.as_view({'delete':'destroy'})

#done 
class CompanyBankViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAuthenticated]



    def create(self, request):

        serializer = CompanyBankSerializer(data=request.data,context={'request':request})
        
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response_dict = {
                'error': False,
                'message': 'Company Bank Data Saved Successfully'
            }
        else:
            response_dict = {
                'error': True,
                'message': 'Error in Saving Company Bank Data'
            }
        return Response(response_dict)
    
    
    def list(self,request):

        company = CompanyBank.objects.all()
        serializer = CompanyBankSerializer(company,many=True,context={'request':request})
        response_dict = {
            'error':False,
            'message':'All Company Bank List List Data',
            'data':serializer.data
        }
        return Response(response_dict)
    
    
    def retrieve(self, request, pk=None):

        queryset = CompanyBank.objects.all()
        company_bank = get_object_or_404(queryset, pk=pk)
        serializer =CompanyBankSerializer(company_bank, context={'request': request})
        return Response({"error": False, "message": "Single Company Bank Details Feteched", "data": serializer.data})
    
    def update(self,request,pk=None):

        queryset = CompanyBank.objects.all()
        company_bank = get_object_or_404(queryset, pk=pk)
        serializer = CompanyBankSerializer(company_bank,data=request.data,context={'request':request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response_dict = {
                'error': False,
                'message': 'Company Bank Data Updated Successfully'
            }
        else:
            response_dict = {
                'error': True,
                'message': 'Error in Updating Company Bank Data'
            }
        return Response(response_dict)



company_bank_list = CompanyBankViewSet.as_view({'get':'list'})
company_bank_create = CompanyBankViewSet.as_view({'post':'create'})
company_bank_create = CompanyBankViewSet.as_view({'put':'update'})

#done 
class CompanyNameViewSet(generics.ListAPIView):
    serializer_class = CompanySerializer
    def get_queryset(self):
        name = self.kwargs["name"]
        return Company.objects.filter(name=name)
        







#done 
class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    
    permission_classes = [IsAuthenticated]

    def create(self, request):

        serializer = MedicineSerializer(data=request.data,context={'request':request})
        
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            #adding and saving id to medical details table 
            #access the latest saved medicine ID from serializer
            medicine_id = serializer.data.get('id')

            medicines_details_list=[]
            for medicine_detail in request.data['medicine_details']:
                #adding medicine id to each medicine detail which will work for medical details as well 
                medicine_detail['medicine'] = medicine_id
                medicines_details_list.append(medicine_detail)


            serializer2 = MedicineDetailsSerializer(data=medicines_details_list,many=True,context={'request':request})
            serializer2.is_valid(raise_exception=True)
            serializer2.save()

            response_dict = {
                'error': False,
                'message': 'Medicine Data Saved Successfully'
            }
        else:
            response_dict = {
                'error': True,
                'message': 'Error in Saving Medicine Data'
            }
        return Response(response_dict)
    
    
    def list(self,request):

        company = Medicine.objects.all()
        serializer = MedicineSerializer(company,many=True,context={'request':request})

        # adding medicine details to each medicine in the list
        medicine_data = serializer.data 
        newmedicinelist = []

        for medicine in medicine_data:
            medicine_details = MedicineDetails.objects.filter(medicine=medicine['id'])
            medicine_details_serializer = MedicineDetailsSerializerSimple(medicine_details, many=True,context={'request':request})
            medicine['medicine_details'] = medicine_details_serializer.data
            newmedicinelist.append(medicine)

        response_dict = {
            'error':False,
            'message':'All Medicine List Data',
            'data':newmedicinelist
        }
        return Response(response_dict)
    
    
    def retrieve(self, request, pk=None):

        queryset = Medicine.objects.all()
        medicine  = get_object_or_404(queryset, pk=pk)
        serializer =MedicineSerializer(medicine, context={'request': request})
        serialize_data = serializer.data 
        
        medicine_details = MedicineDetails.objects.filter(medicine=serialize_data['id'])
        medicine_details_serializer = MedicineDetailsSerializerSimple(medicine_details, many=True,context={'request':request})
        serialize_data['medicine_details'] = medicine_details_serializer.data


        return Response({"error": False, "message": "Single Medicine Details Feteched", "data": serialize_data})
    
    def update(self,request,pk=None):

        queryset = Medicine.objects.all()
        medicine = get_object_or_404(queryset, pk=pk)
        serializer = MedicineSerializer(medicine,data=request.data,context={'request':request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response_dict = {
                'error': False,
                'message': 'Medicine Data Updated Successfully'
            }
        else:
            response_dict = {
                'error': True,
                'message': 'Error in Updating Medicine Data'
            }
        return Response(response_dict)









#done
class MedicineDetailsViewSet(viewsets.ModelViewSet):
    queryset = MedicineDetails.objects.all()
    serializer_class = MedicineDetailsSerializer








#done
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer



class EmployeeBankViewSet(viewsets.ModelViewSet):
    queryset = EmployeeBank.objects.all()
    serializer_class = EmployeeBankSerializer



#done 
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class CompanyAccountViewSet(viewsets.ModelViewSet):
    queryset = CompanyAccount.objects.all()
    serializer_class = CompanyAccountSerializer





class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer

