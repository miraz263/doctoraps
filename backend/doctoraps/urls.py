"""
URL configuration for doctoraps project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from core.views import (
    home, home_page, login_view, logout_view, RegisterView,
    TenantViewSet, UserViewSet, DoctorProfileViewSet,
    PatientViewSet, FamilyMemberViewSet, AppointmentViewSet,
    PrescriptionViewSet, PaymentViewSet, DoctorAvailabilityViewSet
)

# DRF Router setup
router = routers.DefaultRouter()
router.register(r'tenants', TenantViewSet)
router.register(r'users', UserViewSet)
router.register(r'doctors', DoctorProfileViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'family', FamilyMemberViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'prescriptions', PrescriptionViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'doctor-availability', DoctorAvailabilityViewSet)

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),

    # Public Home Page (API root)
    path('', home, name='home'),

    # Django Auth (HTML views)
    path('login/', login_view, name="login_page"),
    path('logout/', logout_view, name="logout_page"),
    path('home/', home_page, name="home_page"),

    # Authentication (JWT + Register API)
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
 
 
   
   



    # Global API endpoints
    path('api/', include(router.urls)),

    # Tenant-specific API endpoints
    path('<slug:tenant_slug>/api/', include(router.urls)),
]
