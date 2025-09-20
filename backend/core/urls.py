from django.urls import path, include
from .views import home 
from rest_framework import routers
from .views import (
    TenantViewSet, UserViewSet, DoctorProfileViewSet,
    PatientViewSet, FamilyMemberViewSet, AppointmentViewSet,
    PrescriptionViewSet, PaymentViewSet, DoctorAvailabilityViewSet
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

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
    path('', home),  # API root test
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)), 
]
