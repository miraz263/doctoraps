from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    home, home_page, login_view, logout_view,
    RegisterView, DoctorRegisterView, stats_view,
    TenantViewSet, UserViewSet, DoctorProfileViewSet,
    PatientViewSet, FamilyMemberViewSet, AppointmentViewSet,
    PrescriptionViewSet, PaymentViewSet, DoctorAvailabilityViewSet,
    LoginAPIView
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
    # Django HTML pages
    path('', home, name='home'),
    path('login/', login_view, name='login_page'),
    path('logout/', logout_view, name='logout_page'),
    path('home/', home_page, name='home_page'),

    # JWT Authentication (SimpleJWT)
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User Registration API
    path('api/auth/register/', RegisterView.as_view(), name='register'),

    # Doctor Profile Registration API
    path('api/doctors/register/', DoctorRegisterView.as_view(), name='doctor_register'),

    # Custom Login API
    path('api/login/', LoginAPIView.as_view(), name='login'),

    # Dashboard Stats API
    path('api/stats/', stats_view, name='stats'),

    # Include DRF router endpoints
    path('api/', include(router.urls)),
]

