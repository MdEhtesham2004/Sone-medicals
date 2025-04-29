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


router.register('employees', EmployeeViewSet)

router.register('employee-banks',EmployeeBankViewSet)
router.register('MedicineStockDetails', MedicineStockViewSet, basename='medicinestock')
router.register('MedicineStockHistory', MedicineStockHistoryViewSet, basename='MedicineStockHistory')
router.register('ManageCustomerCredit', ManageCustomerCreditViewSet, basename='ManageCustomerCredit')
router.register('CustomerCredit', CustomerCreditViewSet, basename='CustomerCredit')
router.register('CustomerCreditDetails', CustomerCreditDetailsViewSet, basename='CustomerCreditDetails')





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
    )
]



