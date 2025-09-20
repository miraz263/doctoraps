import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

# ------------------------------
# Tenant & Users
# ------------------------------

class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    plan = models.CharField(max_length=50, default='free')
    created_at = models.DateTimeField(auto_now_add=True)

class User(AbstractUser):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True)
    role = models.CharField(max_length=50, choices=[
        ('doctor', 'Doctor'),
        ('reception', 'Reception'),
        ('patient', 'Patient')
    ])
    phone = models.CharField(max_length=30, blank=True, null=True)

# ------------------------------
# Doctor & Patient Profiles
# ------------------------------

class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=200)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    working_hours = models.JSONField(default=dict)  # Example: {"mon":["09:00","17:00"], ...}

class Patient(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    dob = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True, null=True)

class FamilyMember(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='family_members')
    name = models.CharField(max_length=200)
    dob = models.DateField(null=True, blank=True)
    relationship = models.CharField(max_length=50)
    health_history = models.JSONField(default=list, blank=True)

# ------------------------------
# Appointments & Prescriptions
# ------------------------------

class Appointment(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(
        max_length=20,
        choices=[('booked','Booked'), ('confirmed','Confirmed'),
                 ('rejected','Rejected'), ('completed','Completed')],
        default='booked'
    )
    consultation_type = models.CharField(
        max_length=20,
        choices=[('video','Video'), ('audio','Audio'), ('chat','Chat')],
        default='video'
    )
    created_at = models.DateTimeField(auto_now_add=True)

class Prescription(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    appointment = models.ForeignKey(Appointment, null=True, blank=True, on_delete=models.SET_NULL)
    diagnosis = models.TextField(blank=True)
    medicines = models.JSONField(default=list)
    prescription_file = models.FileField(upload_to='prescriptions/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

# ------------------------------
# Payment & Doctor Availability
# ------------------------------

class Payment(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=[('pending','Pending'),('completed','Completed'),('failed','Failed')],
        default='pending'
    )
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class DoctorAvailability(models.Model):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE)
    day_of_week = models.IntegerField()  # 0 = Monday, 6 = Sunday
    start_time = models.TimeField()
    end_time = models.TimeField()
