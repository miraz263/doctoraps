from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    home, login_view, logout_view, home_page, RegisterView,
    TenantViewSet, UserViewSet, DoctorProfileViewSet,
    PatientViewSet, FamilyMemberViewSet, AppointmentViewSet,
    PrescriptionViewSet, PaymentViewSet, DoctorAvailabilityViewSet,
)

# -------------------------
# DRF Router
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


]


# -------------------------
# URL Patterns
# -------------------------
urlpatterns = [
    # API test root
    path('', home, name="api_home"),

    # Auth (Django template-based login/logout)
    path('login/', login_view, name="login_page"),
    path('logout/', logout_view, name="logout_page"),
    path('home/', home_page, name="home_page"),

    # JWT Authentication
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User Registration (DRF API)
    path('auth/register/', RegisterView.as_view(), name='register'),

    # API Endpoints from ViewSets
    path('api/', include(router.urls)),
]
