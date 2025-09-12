# core/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from .models import Tenant, DoctorProfile, Patient, Appointment, Prescription
from .serializers import (TenantSerializer, UserSerializer, DoctorProfileSerializer,
                          PatientSerializer, AppointmentSerializer, PrescriptionSerializer)
from .mixins import TenantQuerysetMixin
from .permissions import IsTenantPresent
from rest_framework.permissions import IsAuthenticated, AllowAny

User = get_user_model()

class TenantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [AllowAny]

# Users: creation might be admin-only. For simplicity: restrict to IsAuthenticated and tenant check.
class UserViewSet(TenantQuerysetMixin, viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsTenantPresent]

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)

class DoctorProfileViewSet(TenantQuerysetMixin, viewsets.ModelViewSet):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated, IsTenantPresent]

    def perform_create(self, serializer):
        serializer.save(user=serializer.validated_data['user'],)  # tenant implied via user's tenant

class PatientViewSet(TenantQuerysetMixin, viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated, IsTenantPresent]

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)

class AppointmentViewSet(TenantQuerysetMixin, viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated, IsTenantPresent]

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)

class PrescriptionViewSet(TenantQuerysetMixin, viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated, IsTenantPresent]

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)



def home(request):
    return JsonResponse({"message": "Welcome to DoctorAPS API!"})
