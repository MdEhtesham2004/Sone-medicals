from django.urls import path
from . import views 
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('company', CompanyViewSet,basename='company')
router.register('companybank', CompanyBankViewSet,basename='companybank')
router.register('medicine', MedicineViewSet,basename='medicine')

 


router.register('admins', AdminLoginViewSet)
router.register('customers', CustomerViewSet)
router.register('bills', BillViewSet)

# New ViewSets
router.register('medicine-details', MedicineDetailsViewSet)
router.register('employees', EmployeeViewSet)

router.register('company-accounts', CompanyAccountViewSet)
router.register('employee-banks',EmployeeBankViewSet)




urlpatterns = [
    path('notes/', views.NoteListCreate.as_view(), name='note-list'),
    path('notes/delete/<int:pk>/', views.NoteDelete.as_view(), name='delete-note'),  # Add this line for deleting notes
    path('medical/', include(router.urls)),
    path('companybyname/<str:name>', CompanyNameViewSet.as_view(), name='companybyname'),
]



