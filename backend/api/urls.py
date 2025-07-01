from django.urls import path
from . import views 
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('company', CompanyViewSet,basename='company')
router.register('medicine', MedicineViewSet,basename='medicine')
router.register('generatebill', GenerateBillViewSet,basename='generatebill')
router.register('billdetails',BillDetailsViewSet,basename='billdetails')

 


router.register('admins', AdminLoginViewSet)
router.register('customers', CustomerViewSet)
router.register('bills', BillViewSet)


router.register(',employees', EmployeeViewSet)
router.register('employee-banks',EmployeeBankViewSet)
router.register('MedicineStockDetails', MedicineStockViewSet, basename='medicinestock')
router.register('MedicineStockHistory', MedicineStockHistoryViewSet, basename='MedicineStockHistory')
router.register('CustomerCredit', CustomerCreditViewSet, basename='CustomerCredit')
router.register('CustomerCredit/<int:pk>/', CustomerCreditViewSet, basename='CustomerCreditUnique')
router.register('CustomerCreditDetails', CustomerCreditDetailsViewSet, basename='CustomerCreditDetails')
router.register('CustomerCreditPayment',CustomerCreditPaymentViewSet, basename='CustomerCreditPayment')
router.register('LowStockAlert',LowStockAlertViewSet,basename='LowStockAlert')
router.register('ExpiredMedicineStockAlertViewSet',ExpiredMedicineStockAlertViewSet, basename='ExpiredMedicineStockAlertViewSet'),



urlpatterns = [
    path('notes/', views.NoteListCreate.as_view(), name='note-list'),
    path('notes/delete/<int:pk>/', views.NoteDelete.as_view(), name='delete-note'),  # Add this line for deleting notes
    path('medical/', include(router.urls)),
    path('companybyname/<str:name>', CompanyNameViewSet.as_view(), name='companybyname'),
    path('medicinebyname/<str:name>', MedicineByNameViewSet.as_view(), name='medicinebyname'),
    path(
        'makemedicinedetailsviacompany/<int:company_id>/',
        CreateMedicineWithCompanyViewSet.as_view({'post': 'create_with_company'})
    ),
    path(
        'makemedicinedetailsviacompany/',
        CreateMedicineWithCompanyViewSet.as_view({'post': 'create_with_company'})
    ),
    path('customer-summary/<int:customer_id>/', CustomerBillSummary.as_view(), name='customer-summary'),
    path('customer-summary/', CustomerBillSummary.as_view(), name='all-customer-summary'),
    path('MarkAsOrderedAPIView/<int:pk>/',MarkAsOrderedAPIView.as_view(), name='MarkAsOrderedAPIView'),
    path('CheckLowStock/',CheckLowStockApiView.as_view(), name='CheckLowStockApiView'),
    path('BackupToExcelAPIView',BackupToExcelAPIView.as_view(), name='BackupToExcelAPIView'),
     path('backup_download/', DownloadFileView.as_view(), name='backup_download'),
]




