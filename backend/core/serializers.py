# core/serializers.py
from rest_framework import serializers
from .models import Tenant, User, DoctorProfile, Patient, Appointment, Prescription
from django.contrib.auth import get_user_model
UserModel = get_user_model()

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ['id','name','slug','plan','created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['id','username','email','first_name','last_name','role','phone','tenant']
        read_only_fields = ['tenant']  # tenant assigned from URL or admin

class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(write_only=True, queryset=UserModel.objects.all(), source='user')
    class Meta:
        model = DoctorProfile
        fields = ['id','user','user_id','specialization','consultation_fee','working_hours']

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id','tenant','name','dob','phone','email','address']
        read_only_fields = ['tenant']

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id','tenant','doctor','patient','start_time','end_time','status','created_at']
        read_only_fields = ['tenant','created_at']

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['id','tenant','doctor','patient','appointment','diagnosis','medicines','created_at']
        read_only_fields = ['tenant','created_at']
