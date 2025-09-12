# core/models.py
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

# Custom User for role management
class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    plan = models.CharField(max_length=50, default='free')
    created_at = models.DateTimeField(auto_now_add=True)

class User(AbstractUser):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True)
    role = models.CharField(max_length=50, choices=[
        ('doctor', 'Doctor'), ('reception', 'Reception'), ('patient', 'Patient')
    ])
    phone = models.CharField(max_length=30, blank=True, null=True)

class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=200)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    working_hours = models.JSONField(default=dict)

class Patient(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    dob = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True, null=True)

class Appointment(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=50, default='booked')

class Prescription(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    appointment = models.ForeignKey(Appointment, null=True, blank=True, on_delete=models.SET_NULL)
    diagnosis = models.TextField(blank=True)
    medicines = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

