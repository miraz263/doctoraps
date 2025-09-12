from django.contrib import admin
from .models import Tenant, User, DoctorProfile, Patient, Appointment, Prescription
from django.contrib.auth import get_user_model
admin.site.register(Tenant)
admin.site.register(get_user_model())
admin.site.register(DoctorProfile)
admin.site.register(Patient)
admin.site.register(Appointment)
admin.site.register(Prescription)
