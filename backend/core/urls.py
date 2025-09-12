# core/urls.py
from django.urls import path, include
from rest_framework import routers
from .views import (TenantViewSet, UserViewSet, DoctorProfileViewSet,
                    PatientViewSet, AppointmentViewSet, PrescriptionViewSet)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter()
router.register(r'tenants', TenantViewSet, basename='tenants')
router.register(r'users', UserViewSet, basename='users')
router.register(r'doctors', DoctorProfileViewSet, basename='doctors')
router.register(r'patients', PatientViewSet, basename='patients')
router.register(r'appointments', AppointmentViewSet, basename='appointments')
router.register(r'prescriptions', PrescriptionViewSet, basename='prescriptions')

urlpatterns = [
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),     # /{tenant_slug}/api/auth/token/
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
