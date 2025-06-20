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
from datetime import date 
from rest_framework.decorators import action
from . backup import backup_to_excel
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
        # try:
            # 1. Save customer
            customer_serializer = CustomerSerializer(data=request.data, context={'request': request})
            total_amount = request.data.get('total_amount', 0)  # Assuming total_amount is passed in request data
            customer_serializer.is_valid(raise_exception=True)
            customer = customer_serializer.save()
            customer_id = customer.id

            # 2. Save bill
            bill_data = {
                'customer': customer_id,
                'total_amount':total_amount
            }

            
            bill_serializer = BillSerializer(data=bill_data, context={'request': request})
            bill_serializer.is_valid(raise_exception=True)
            bill = bill_serializer.save()
            bill_id = bill.id

            # 3. Save bill details
            medicine_data_list = []
            for medicine_details in request.data.get("medicine_details", []):
                medicine_data = {
                    "medicine": medicine_details["id"],
                    "bill": bill_id,
                    "qty": medicine_details["qty"],
                    "rate": medicine_details["rate"]
                }
                medicine_data_list.append(medicine_data)

                # Get the medicine object and calculate total price
                try:
                    medicine = Medicine.objects.get(id=medicine_details["id"])
                except Medicine.DoesNotExist:
                    raise ValueError(f"Medicine with ID {medicine_details['id']} does not exist.")

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
                print(f"- {medicine.name}, Quantity: {medicine_item['qty']}, Rate: {medicine_item['rate']}, Total: {medicine_item['rate'] * int(medicine_item['qty'])}")

            print(f"Total Bill Amount: {total_amount}")
            print(f"-------------------------")
 
            # Respond with success
            response_dict = {
                "error": False,
                "message": "Bill Generated Successfully!",
                "bill_id": bill_id,
                "total_amount": total_amount  # Include the total bill amount in the response
            }

        # except Exception as e:
        #     print("Error while generating bill:", str(e))
        #     response_dict = {
        #         "error": True,
        #         "message": f"Error while generating the bill: {str(e)}"
        #     }

            return Response(response_dict)  

class CreateMedicineWithCompanyViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer

    def create_with_company(self, request, company_id=None):
        if company_id is not None:
            company = get_object_or_404(Company, id=company_id)
            data = request.data.copy()

            data['company'] = company.id
            data['amt_after_gst'] = float(data['mrp']) + (float(data['mrp']) * float(data['gst']) / 100)

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

    def retrieve(self, request, pk=None):
        try:
            customer = CustomerCredit.objects.get(id=pk)
        except CustomerCredit.DoesNotExist:
            return Response({'error': 'Customer Credit not found'}, status=status.HTTP_404_NOT_FOUND)

        # Fetch related medicines and payments
        customer_details = CustomerCreditDetails.objects.filter(customer_credit=customer)
        customer_payment_details = CustomerCreditPaymentDetails.objects.filter(customer_credit=customer)

        details = {
            'customer': CustomerCreditSerializer(customer, context={'request': request}).data,
            'customer_details': CustomerCreditDetailsSerializer(customer_details, many=True, context={'request': request}).data,
            'customer_payment_details': CustomerCreditPaymentSerializer(customer_payment_details, many=True, context={'request': request}).data
        }

        response_dict = {
            'error': False,
            'message': 'Single Customer Credit Data Fetched',
            'data': details
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

class CustomerCreditPaymentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = CustomerCreditPaymentDetails.objects.all()
    serializer_class = CustomerCreditPaymentSerializer

    def list(self, request):
        queryset = CustomerCreditPaymentDetails.objects.all()
        serializer = CustomerCreditPaymentSerializer(queryset, many=True, context={'request': request})
        response_dict = {
            'error': False,
            'message': 'All Customer Credit Details List Data',
            'data': serializer.data
        }
        return Response(response_dict)
    
     
    def create(self, request):
        serializer = CustomerCreditPaymentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()

            amount = request.data.get('payment_amount', 0)
            customer_credit = request.data.get('customer_credit', None)
            payment_date = request.data.get('payment_date', None)
            if customer_credit is not None:
                try:
                    customer_credit_instance = CustomerCredit.objects.get(id=customer_credit)
                    customer_credit_instance.last_payment_amount = amount
                    customer_credit_instance.last_payment_date = payment_date

                    customer_credit_medicine_instance = CustomerCreditDetails.objects.get(customer_credit=customer_credit_instance)
                    customer_medicine_amount = customer_credit_medicine_instance.amount 

                    customer_credit_instance.pending_amount = customer_medicine_amount - amount
                    if customer_credit_instance.pending_amount < 0:
                        customer_credit_instance.pending_amount = 0
                    
                    customer_credit_medicine_instance.save()
                    customer_credit_instance.save()
                except CustomerCredit.DoesNotExist:
                    return Response({
                        'error': True,
                        'message': f"Customer Credit with ID {customer_credit} does not exist."
                    }, status=400)
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

        queryset = CustomerCreditPaymentDetails.objects.all()
        medicine = get_object_or_404(queryset, pk=pk)
        serializer = CustomerCreditPaymentSerializer(medicine,data=request.data,context={'request':request})
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
        queryset = CustomerCreditPaymentDetails.objects.get(id=pk)
        company = get_object_or_404(CustomerCreditPaymentDetails, id=pk)
        company.delete()
       
        response_dict = {
            'error': False,
            'message': 'Customer Credit Details Data Deleted Successfully'
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



class LowStockAlertViewSet(viewsets.ModelViewSet):
    queryset = LowStockAlert.objects.all()
    serializer_class = LowStockAlertSerializer

    def list(self, request):
        # check_low_stock()
        queryset = LowStockAlert.objects.all()
        serializer = LowStockAlertSerializer(queryset, many=True, context={'request': request})
        response_dict = {
            'error': False,
            'message': 'All Low Stock Alert List Data',
            'data': serializer.data
        }
        return Response(response_dict)

  

class CheckLowStockApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        status = check_low_stock()
        # queryset = LowStockAlert.objects.all()
        # serializer = LowStockAlertSerializer(queryset, many=True, context={'request': request})
        response_dict = {
            'error': False,
            'message': 'All Low Stock Alert List Data',
            "status": status,
            'data': "Low stock check completed. Please check the alerts."
        }
        return Response(response_dict)
    


def check_low_stock():
    medicine = MedicineStock.objects.all()
    threshold = 10  # Configurable

    for med in medicine:
        if med.in_stock_total < threshold:
            # Check if any open alert exists for this medicine
            exists = LowStockAlert.objects.filter(
                medicine_name=med.name,
                ordered=False  # Only check for unhandled alerts
            ).exists()

            if not exists:
                LowStockAlert.objects.create(
                    medicine_name=med.name,
                    current_quantity=med.in_stock_total,
                    alert_date=date.today()
                )
    return "Success"


class MarkAsOrderedAPIView(APIView):
    def post(self, request, pk):
        try:
            alert = LowStockAlert.objects.get(id=pk)
            alert.ordered = 1  # You can safely write 1 here if you want: alert.ordered = 1
            alert.save()
            return Response({'message': 'Marked as ordered successfully'})
        except LowStockAlert.DoesNotExist:
            return Response({'error': 'Alert not found'}, status=status.HTTP_404_NOT_FOUND)




# Creating expired medicine stock alerts
class ExpiredMedicineStockAlertViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = ExpiryMedicine.objects.all()
    serializer_class = ExpiryMedicineSerializer

    def list(self, request, *args, **kwargs):
        # First: Run your check lo  gic before listing
        status = check_expired_medicines()

        # Now get the queryset after check is done
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        response_dict = {
            'error': False,
            'message': 'Expired medicine check completed',
            "status": status,
            'data': serializer.data
        }
        return Response(response_dict)

def check_expired_medicines():
    medicines = Medicine.objects.all()
    today = date.today()

    for med in medicines:
        if med.exp_date and med.exp_date < today:
            exists = ExpiryMedicine.objects.filter(
                name=med.name,
                batch_no=med.batch_no,
                exp_date=med.exp_date
            ).exists()

            if not exists:
                ExpiryMedicine.objects.create(
                    name=med.name,
                    mrp=med.mrp,
                    rate=med.rate,
                    pack=med.pack,
                    c_gst=med.c_gst,
                    s_gst=med.s_gst,
                    gst=med.gst,
                    amt_aftr_gst=med.amt_aftr_gst,
                    batch_no=med.batch_no,
                    exp_date=med.exp_date,
                    mfg_date=med.mfg_date,
                    company=med.company.name if med.company else None,
                    qty_in_strip=med.qty_in_strip
                )
    return "Success"



class BackupToExcelAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        backup_file = backup_to_excel()
        return Response({"message": f"Backup completed successfully at {backup_file}"})