from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated,AllowAny
from .serializers import UserSerializer,NoteSerializer
from .models import Note
from rest_framework import viewsets
from .models import Company, Medicine, AdminLogin, Customer, Bill
from .serializers import *
from django.db import transaction
from rest_framework.views import APIView
from rest_framework import status



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

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request):
        serializer = MedicineSerializer(data=request.data, context={'request': request})

        if serializer.is_valid(raise_exception=True):
            medicine = serializer.save()  # Save medicine and get the object back

            # Find related MedicineStock
            try:
                medicine_stock = MedicineStock.objects.get(name=medicine.name)
            except MedicineStock.DoesNotExist:
                medicine_stock = None

            if medicine_stock:
                # Create Stock History record
                create_stock_history_for_medicine(medicine)

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
            # 1. Save customer
            customer_serializer = CustomerSerializer(data=request.data, context={'request': request})
            customer_serializer.is_valid(raise_exception=True)
            customer = customer_serializer.save()
            customer_id = customer.id

            # 2. Save bill
            bill_data = {
                'customer': customer_id
            }
            bill_serializer = BillSerializer(data=bill_data, context={'request': request})
            bill_serializer.is_valid(raise_exception=True)
            bill = bill_serializer.save()
            bill_id = bill.id

            # 3. Save bill details
            medicine_data_list = []
            total_amount = 0  # Initialize total amount for the bill
            for medicine_details in request.data.get("medicine_details", []):
                medicine_data = {
                    "medicine": medicine_details["id"],
                    "bill": bill_id,
                    "qty": medicine_details["qty"]
                }
                medicine_data_list.append(medicine_data)

                # Get the medicine object and calculate total price
                medicine = Medicine.objects.get(id=medicine_details["id"])
                medicine_price = medicine.rate
                qty = int(medicine_details["qty"])
                total_amount += medicine_price * qty

            # Save bill details
            bill_details_serializer = BillDetailsSerializer(data=medicine_data_list, many=True, context={'request': request})
            bill_details_serializer.is_valid(raise_exception=True)
            bill_details_serializer.save()

            print("Medicine Data List:", medicine_data_list)

            # 4. Deduct from MedicineStock + Save in MedicineStockHistory
            for medicine_item in medicine_data_list:
                # Get the medicine from Medicine table
                medicine = Medicine.objects.get(id=medicine_item['medicine'])

                # Get the stock for that medicine
                try:
                    medicine_stock = MedicineStock.objects.get(name=medicine.name)
                except MedicineStock.DoesNotExist:
                    raise ValueError(f"No stock entry found for medicine: {medicine.name}")

                qty_requested = int(medicine_item['qty'])

                # Check stock availability
                if medicine_stock.in_stock_total < qty_requested:
                    response_dict = {
                        "error": True,
                        "message": f"Not enough stock for {medicine_stock.name}! Available: {medicine_stock.in_stock_total}, Requested: {qty_requested}"
                    }
                    return Response(response_dict)

                # Deduct stock
                medicine_stock.in_stock_total -= qty_requested
                medicine_stock.save()

                # Create stock history entry
                MedicineStockHistory.objects.create(
                    medicine=medicine_stock,
                    quantity=qty_requested,
                    transaction_type='OUT'
                )

            # 5. Success - Show the printout of the bill
            print(f"\n----- Bill Printout -----")
            print(f"Customer Name: {customer.name}")
            print(f"Customer Address: {customer.address}")
            print(f"Customer Contact: {customer.contact}")
            print(f"Bill ID: {bill_id}")
            print(f"Medicine Details:")
            for medicine_item in medicine_data_list:
                medicine = Medicine.objects.get(id=medicine_item['medicine'])
                print(f"- {medicine.name}, Quantity: {medicine_item['qty']}, Rate: {medicine.rate}, Total: {medicine.rate * int(medicine_item['qty'])}")

            print(f"Total Bill Amount: {total_amount}")
            print(f"-------------------------")

            # Respond with success
            response_dict = {
                "error": False,
                "message": "Bill Generated Successfully!",
                "bill_id": bill_id,
                "total_amount": total_amount  # Include the total bill amount in the response
            }

        except Exception as e:
            print("Error while generating bill:", str(e))
            response_dict = {
                "error": True,
                "message": f"Error while generating the bill: {str(e)}"
            }

        return Response(response_dict)

class CreateMedicineWithCompanyViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer

    def create_with_company(self, request, company_id=None):
        if company_id is not None:
            company = get_object_or_404(Company, id=company_id)
            data = request.data.copy()

            data['company'] = company.id
            data['amt_after_gst'] = int(data['mrp']) + (int(data['mrp']) * int(data['gst']) / 100)

            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                medicine = serializer.save()
                create_stock_history_for_medicine(medicine)  # ✨ clean!

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        else:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                medicine = serializer.save()
                create_stock_history_for_medicine(medicine)  # ✨ clean!

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


class MedicineStockHistoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = MedicineStockHistory.objects.all()
    serializer_class = MedicineStockHistorySerializer

    def list(self, request):
        queryset = MedicineStockHistory.objects.all()
        serializer = MedicineStockHistorySerializer(queryset, many=True, context={'request': request})
        response_dict = {
            'error': False,
            'message': 'All Medicine Stock History List Data',
            'data': serializer.data
        }
        return Response(response_dict)


class CustomerCreditViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = CustomerCredit.objects.all()
    serializer_class = CustomerCreditSerializer

    def list(self, request):
        queryset = CustomerCredit.objects.all()
        serializer = CustomerCreditSerializer(queryset, many=True, context={'request': request})
        response_dict = {
            'error': False,
            'message': 'All Customer Credit List Data',
            'data': serializer.data
        }
        return Response(response_dict)
    
    def create(self, request):
        serializer = CustomerCreditSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response_dict = {
                'error': False,
                'message': 'Customer Credit Data Saved Successfully'
            }
        else:
            response_dict = {
                'error': True,
                'message': 'Error in Saving Customer Credit Data'
            }
        return Response(response_dict)
   
   
    def update(self,request,pk=None):

        queryset = CustomerCredit.objects.all()
        medicine = get_object_or_404(queryset, pk=pk)
        serializer = CustomerCreditSerializer(medicine,data=request.data,context={'request':request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response_dict = {
                'error': False,
                'message': 'Customer Credit Data Updated Successfully'
            }
        else:
            response_dict = {
                'error': True,
                'message': 'Error in Updating Customer Credit  Data'
            }
        return Response(response_dict)


    def delete(self,request,pk=None):
        queryset = CustomerCredit.objects.get(id=pk)
        company = get_object_or_404(CustomerCredit, id=pk)
        company.delete()
       
        response_dict = {
            'error': False,
            'message': 'Customer Credit Data Deleted Successfully'
        }
        
        return Response(response_dict)
    


    
    



class CustomerCreditDetailsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = CustomerCreditDetails.objects.all()
    serializer_class = CustomerCreditDetailsSerializer

    def list(self, request):
        queryset = CustomerCreditDetails.objects.all()
        serializer = CustomerCreditDetailsSerializer(queryset, many=True, context={'request': request})
        response_dict = {
            'error': False,
            'message': 'All Customer Credit Details List Data',
            'data': serializer.data
        }
        return Response(response_dict)
    
     
    def create(self, request):
        serializer = CustomerCreditDetailsSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response_dict = {
                'error': False,
                'message': ' Customer Credit Details Saved Successfully'
            }
        else:
            response_dict = {
                'error': True,
                'message': 'Error in Saving Customer Credit Details Data'
            }
        return Response(response_dict)
   
   
    def update(self,request,pk=None):

        queryset = CustomerCreditDetails.objects.all()
        medicine = get_object_or_404(queryset, pk=pk)
        serializer = CustomerCreditDetailsSerializer(medicine,data=request.data,context={'request':request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response_dict = {
                'error': False,
                'message': 'Customer Credit Details  Updated Successfully'
            }
        else:
            response_dict = {
                'error': True,
                'message': 'Error in Updating Customer Credit Details '
            }
        return Response(response_dict)

    def delete(self,request,pk=None):
        queryset = CustomerCreditDetails.objects.get(id=pk)
        company = get_object_or_404(CustomerCreditDetails, id=pk)
        company.delete()
       
        response_dict = {
            'error': False,
            'message': 'Customer Credit Details Data Deleted Successfully'
        }
        
        return Response(response_dict)


class ManageCustomerCreditViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        queryset = CustomerCredit.objects.all()
        serializer = CustomerCreditSerializer(queryset, many=True, context={'request': request})
        response_dict = {
            'error': False,
            'message': 'All Manage Customer Credit List Data',
            'data': serializer.data
        }
        return Response(response_dict)

    def create(self, request):
        # Step 1: Extract data from the request
        customer_data = request.data.get('customer_credit')
        customer_credit_details = request.data.get('customer_credit_details', [])

        if not customer_credit_details:
            return Response({
                'error': True,
                'message': 'customer_credit_details is required.'
            }, status=400)

        # Step 2: Calculate the total amount
        final_total_amount = 0
        for item in customer_credit_details:
            try:
                medicine = Medicine.objects.get(id=item['medicine'])
            except Medicine.DoesNotExist:
                return Response({
                    'error': True,
                    'message': f"Medicine with ID {item['medicine']} does not exist."
                }, status=400)
            
            medicine_price = medicine.mrp
            quantity = item['quantity']
            total = medicine_price * quantity
            final_total_amount += total
        
        customer_data['amount'] = final_total_amount

        # Step 3: Create the CustomerCredit record
        serializer = CustomerCreditSerializer(data=customer_data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            customer_credit = serializer.save()
            customer_credit_id = customer_credit.id

            # Step 4: Create CustomerCreditConnect
            connect_data = {"customer_credit": customer_credit_id}
            serializer2 = CustomerConnectSerializer(data=connect_data, context={'request': request})
            if serializer2.is_valid(raise_exception=True):
                connect = serializer2.save()

            # Step 5: Create CustomerCreditDetails (Medicine Details)
            customer_update_details = [
                {**item, 'customer_credit': connect.id} for item in customer_credit_details
            ]
            
            try:
                with transaction.atomic():
                    serializer3 = CustomerCreditDetailsSerializer(data=customer_update_details, many=True, context={'request': request})
                    if serializer3.is_valid(raise_exception=True):
                        serializer3.save()

                response_dict = {
                    'error': False,
                    'message': 'Customer Credit Data Saved Successfully'
                }
                return Response(response_dict)

            except Exception as e:
                response_dict = {
                    'error': True,
                    'message': f"Error in Saving Customer Credit Data: {str(e)}"
                }
                return Response(response_dict)

        return Response({"error": True, "message": "Invalid Customer Data"}, status=400)


class ShowAllCustomerCreditViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """Returns all customer credit records with nested medicine details."""
        queryset = CustomerCredit.objects.all()
        serializer = CustomerCreditSerializer(queryset, many=True, context={'request': request})
        response_dict = {
            'error': False,
            'message': 'All Customer Credit List Data',
            'data': serializer.data
        }
        return Response(response_dict)


from rest_framework.views import APIView

class CustomerBillSummary(APIView):
    def get(self, request, customer_id=None):
        if customer_id:
            try:
                # Fetch the customer by ID
                customer = Customer.objects.get(id=customer_id)
            except Customer.DoesNotExist:
                return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

            # Get all BillDetails for this specific customer
            bill_details = BillDetails.objects.select_related('bill', 'medicine').filter(bill__customer=customer)

            # Extract unique bills and medicines from the BillDetails
            bills = list({bd.bill for bd in bill_details})
            medicines = list({bd.medicine for bd in bill_details})

            # Serialize the data
            bill_data = BillSerializer(bills, many=True).data
            medicine_data = MedicineSerializer(medicines, many=True).data

            # Prepare the response with customer details
            result = {
                "customer": CustomerSerializer(customer).data,  # Include all customer details
                "customer_bill": bill_data,
                "customer_medicines": medicine_data,
            }
            return Response(result, status=status.HTTP_200_OK)

        # If no customer_id, return summaries for all customers
        customers = Customer.objects.all()
        all_data = []

        for customer in customers:
            bill_details = BillDetails.objects.select_related('bill', 'medicine').filter(bill__customer=customer)

            # Extract unique bills and medicines
            bills = list({bd.bill for bd in bill_details})
            medicines = list({bd.medicine for bd in bill_details})

            # Serialize the data
            bill_data = BillSerializer(bills, many=True).data
            medicine_data = MedicineSerializer(medicines, many=True).data

            # Prepare the summary for this customer
            customer_summary = {
                "customer": CustomerSerializer(customer).data,  # Include all customer details
                "customer_bill": bill_data,
                "customer_medicines": medicine_data,
            }
            all_data.append(customer_summary)

        return Response(all_data, status=status.HTTP_200_OK)
