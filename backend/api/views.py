from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated,AllowAny
from .serializers import UserSerializer,NoteSerializer
from .models import Note
from rest_framework import viewsets
from .models import Company, Medicine, AdminLogin, Customer, Bill
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
    serializer_class = MedicineSerializer

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
        if serializer.is_valid(raise_exception=True):
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
    

    def destroy(self,request,pk=None):
        queryset = Company.objects.get(id=pk)
        company = get_object_or_404(Company, id=pk)
        company.delete()
        response_dict = {
            'error': False,
            'message': 'Company Data Deleted Successfully'
        }
        return Response(response_dict)

     
    def retrieve(self, request, pk=None):
        queryset = Company.objects.all()
        medicine  = get_object_or_404(queryset, pk=pk)
        serializer =CompanySerializer(medicine, context={'request': request})
        serialize_data = serializer.data 

        return Response({"error": False, "message": "Single Medicine Details Feteched", "data": serialize_data})
    



company_list = CompanyViewSet.as_view({'get':'list'})
company_create = CompanyViewSet.as_view({'post':'create'})
company_update = CompanyViewSet.as_view({'put':'update'})
company_delete = CompanyViewSet.as_view({'delete':'destroy'})
#done 
class CompanyNameViewSet(generics.ListAPIView):
    serializer_class = CompanySerializer
    def get_queryset(self):
        name = self.kwargs["name"]
        return Company.objects.filter(name=name)
        




class MedicineByNameViewSet(generics.ListAPIView):
    serializer_class = MedicineSerializer
    def get_queryset(self):
        name = self.kwargs["name"]
        return Medicine.objects.filter(name=name)


#done 
class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    
    permission_classes = [IsAuthenticated]

    def create(self, request):
        serializer = MedicineSerializer(data=request.data, context={'request':request})

        if serializer.is_valid(raise_exception=True):
            serializer.save()

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

        response_dict = {
            'error':False,
            'message':'All Medicine List Data',
            'data':serializer.data 
        }
        return Response(response_dict)
    
    
    def retrieve(self, request, pk=None):

        queryset = Medicine.objects.all()
        medicine  = get_object_or_404(queryset, pk=pk)
        serializer =MedicineSerializer(medicine, context={'request': request})
        serialize_data = serializer.data 

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



    
    def delete(self,request,pk=None):
        queryset = Medicine.objects.get(id=pk)
        company = get_object_or_404(Medicine, id=pk)
        company.delete()
       
        response_dict = {
            'error': False,
            'message': 'Medicine Data Deleted Successfully'
        }
        
        return Response(response_dict)







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





class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer


class BillDetailsViewSet(viewsets.ModelViewSet):
    queryset=BillDetails.objects.all()
    serializer_class=BillDetailsSerializer

class GenerateBillViewSet(viewsets.ModelViewSet):    
    permission_classes = [IsAuthenticated]

    def create(self, request):
        try:
            # 1. Save customer data
            customer_serializer = CustomerSerializer(data=request.data, context={'request': request})
            customer_serializer.is_valid(raise_exception=True)
            customer = customer_serializer.save()  # This returns the saved instance
            customer_id = customer.id

            # 2. Save bill data
            bill_data = {
                'customer': customer_id
                # Add more bill fields if needed (e.g., date, total, etc.)
            }

            bill_serializer = BillSerializer(data=bill_data,context={'request': request})
            bill_serializer.is_valid(raise_exception=True)
            bill = bill_serializer.save()
            bill_id = bill.id

            # 3. Save bill details (medicine list)
            medicine_data_list = []
            for medicine_details in request.data.get("medicine_details", []):
                medicine_data = {
                    "medicine": medicine_details["id"],
                    "bill": bill_id,
                    "qty": medicine_details["qty"]
                }
                medicine_data_list.append(medicine_data)

            bill_details_serializer = BillDetailsSerializer(data=medicine_data_list, many=True, context={'request': request})
            bill_details_serializer.is_valid(raise_exception=True)
            bill_details_serializer.save()
            print("Medicine Data List:", medicine_data_list)
    

            # 4. Success response
            response_dict = {
                "error": False,
                "message": "Bill Generated Successfully!",
                "bill_id": bill_id
            }
        except Exception as e:
            print("Error while generating bill:", str(e))  # Shows actual Python error
            response_dict = {
                "error": True,
                "message": f"Error while generating the bill: {str(e)}"
            }

        return Response(response_dict)


class CreateMedicineWithCompanyViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer

    def create_with_company(self, request, company_id=None):
        # If company_id is provided, associate the medicine with the company
        if company_id is not None:
            # 1. Get the company from the database using the ID passed via URL
            company = get_object_or_404(Company, id=company_id)

            # 2. Copy the incoming POST data (name, description, price, etc.)
            data = request.data.copy()

            # 3. Add the company ID to the data so that it gets linked properly
            data['company'] = company.id
            data['amt_after_gst'] = data['mrp'] + (data['mrp'] * data['gst'] / 100)  # Calculate amount after GST

            # 4. Validate and save using serializer
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # If no company_id is provided, save the data without associating it with a company
        else:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
        


class MedicineStockViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = MedicineStock.objects.all()
    serializer_class = MedicineStockSerializer

    def list(self, request):
        queryset = MedicineStock.objects.all()
        serializer = MedicineStockSerializer(queryset, many=True, context={'request': request})
        response_dict = {
            'error': False,
            'message': 'All Medicine Stock List Data',
            'data': serializer.data
        }
        return Response(response_dict)
    
medicine_list = MedicineStockViewSet.as_view({'get':'list'})
medicine_create = MedicineStockViewSet.as_view({'post':'create'})
medicine_update = MedicineStockViewSet.as_view({'put':'update'})
medicine_delete = MedicineStockViewSet.as_view({'delete':'destroy'})
