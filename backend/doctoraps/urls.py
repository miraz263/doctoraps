"""
URL configuration for doctoraps project.
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from core.views import (
    home, home_page, login_view, logout_view,
    RegisterView, DoctorRegisterView, stats_view,
    TenantViewSet, UserViewSet, DoctorProfileViewSet,
    PatientViewSet, FamilyMemberViewSet, AppointmentViewSet,
    PrescriptionViewSet, PaymentViewSet, DoctorAvailabilityViewSet
)

# -------------------------
# DRF Router setup
# -------------------------
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

# -------------------------
# URL Patterns
# -------------------------
urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),

    # Public Home Page (API root)
    path('', home, name='home'),

    # Django Auth (HTML views)
    path('login/', login_view, name="login_page"),
    path('logout/', logout_view, name="logout_page"),
    path('home/', home_page, name="home_page"),

    # JWT Authentication
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User Registration (API)
    path('auth/register/', RegisterView.as_view(), name='register'),

    # Doctor Registration (API)
    path('api/doctors/register/', DoctorRegisterView.as_view(), name='doctor_register'),

    # Dashboard Stats API
    path('api/stats/', stats_view, name='stats'),

    # Global API endpoints from ViewSets
    path('api/', include(router.urls)),

    # Optional: Tenant-specific API endpoints
    path('<slug:tenant_slug>/api/', include(router.urls)),
]
