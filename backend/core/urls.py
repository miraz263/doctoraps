from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    home,
    login_view,
    logout_view,
    home_page,
    RegisterView,
    DoctorRegisterView,
    TenantViewSet,
    UserViewSet,
    DoctorProfileViewSet,
    PatientViewSet,
    FamilyMemberViewSet,
    AppointmentViewSet,
    PrescriptionViewSet,
    PaymentViewSet,
    DoctorAvailabilityViewSet,
    stats_view,
)

# -------------------------
# DRF Router
# -------------------------
router = routers.DefaultRouter()
router.register(r'tenants', TenantViewSet)
router.register(r'users', UserViewSet)
router.register(r'doctors', DoctorProfileViewSet)  # GET/PUT/PATCH/DELETE list & detail
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
    # Django pages
    path('', home, name="api_home"),
    path('login/', login_view, name="login_page"),
    path('logout/', logout_view, name="logout_page"),
    path('home/', home_page, name="home_page"),

    # JWT Auth
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User Registration
    path('api/auth/register/', RegisterView.as_view(), name='register'),

    # Doctor Registration (Custom endpoint)
    path('api/doctors/register/', DoctorRegisterView.as_view(), name='doctor_register'),

    # Dashboard Stats
    path('api/stats/', stats_view, name='stats'),

    # ViewSets (Router)
    path('api/', include(router.urls)),
]
