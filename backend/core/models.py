import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# ------------------------------
# Existing User model
# ------------------------------
class User(AbstractUser):
    ROLE_CHOICES = [
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
        ('agent', 'Agent/Tennent'),
        ('management', 'Management'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')

    # ✅ Optional: string representation to include role
    def __str__(self):
        return f"{self.username} ({self.role})"


# ------------------------------
# Tenant & Users
# ------------------------------
class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    plan = models.CharField(max_length=50, default='free')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)  # keep null=True for old rows

    def __str__(self):
        return self.name



# ------------------------------
# Doctor & Patient Profiles
# ------------------------------
class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="doctor_profile")
    name = models.CharField(max_length=200, blank=True, null=True)
    specialization = models.CharField(max_length=200)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    working_hours = models.JSONField(default=dict, blank=True)
    bio = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self):
        return f"Dr. {self.name} ({self.specialization})"


class Patient(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="patient_profile", null=True, blank=True)
    name = models.CharField(max_length=200)
    dob = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self):
        return self.name


class FamilyMember(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='family_members')
    name = models.CharField(max_length=200)
    dob = models.DateField(null=True, blank=True)
    relationship = models.CharField(max_length=50)
    health_history = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.name} ({self.relationship})"


# ------------------------------
# Appointments & Prescriptions
# ------------------------------
class Appointment(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name="appointments")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(
        max_length=20,
        choices=[('booked', 'Booked'), ('confirmed', 'Confirmed'), ('rejected', 'Rejected'), ('completed', 'Completed')],
        default='booked'
    )
    consultation_type = models.CharField(max_length=20, choices=[('video', 'Video'), ('audio', 'Audio'), ('chat', 'Chat')], default='video')
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self):
        return f"Appointment: {self.patient.name} with {self.doctor.user.username} ({self.status})"


class Prescription(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    appointment = models.ForeignKey(Appointment, null=True, blank=True, on_delete=models.SET_NULL)
    diagnosis = models.TextField(blank=True)
    medicines = models.JSONField(default=list)
    prescription_file = models.FileField(upload_to='prescriptions/', null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self):
        return f"Prescription for {self.patient.name} by {self.doctor.username}"


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
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending')
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self):
        return f"Payment {self.amount} by {self.patient.name} ({self.status})"


class DoctorAvailability(models.Model):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name="availability")
    day_of_week = models.IntegerField()  # 0 = Monday, 6 = Sunday
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.doctor.user.username} - {self.day_of_week} ({self.start_time} - {self.end_time})"
