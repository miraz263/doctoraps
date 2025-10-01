from rest_framework import serializers
from .models import (
    Tenant, User, DoctorProfile, Patient, FamilyMember,
    Appointment, Prescription, Payment, DoctorAvailability
)

# -------------------------
# Tenant Serializer
# -------------------------
class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ['id', 'name', 'address', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


# -------------------------
# User Serializer
# -------------------------
class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'full_name', 'is_active', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()


# -------------------------
# Doctor Profile Serializer
# -------------------------
class DoctorProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source="user", write_only=True
    )

    class Meta:
        model = DoctorProfile
        fields = ['id', 'user', 'user_id', 'name', 'specialization',
                  'consultation_fee', 'working_hours', 'bio', 'created_at']
        read_only_fields = ['id', 'created_at']



    def validate(self, attrs):
        user = attrs.get('user')
        specialization = attrs.get('specialization')

        if not user:
            # ফ্রন্টএন্ডে key: user_id
            raise serializers.ValidationError({'user_id': 'This field is required.'})

        if not specialization:
            raise serializers.ValidationError({'specialization': 'This field is required.'})

        # Create কেসে এক ইউজারের জন্য ডুপ্লিকেট DoctorProfile আটকান
        if self.instance is None:
            if DoctorProfile.objects.filter(user=user).exists():
                raise serializers.ValidationError({'user_id': 'DoctorProfile already exists for this user.'})
        else:
            # Update কেসে user বদলাতে চাইলে ডুপ্লিকেট চেক
            if self.instance.user != user and DoctorProfile.objects.filter(user=user).exists():
                raise serializers.ValidationError({'user_id': 'Another DoctorProfile already exists for this user.'})

        return attrs

    def create(self, validated_data):
        user = validated_data.get('user')
        # name/email না থাকলে user থেকে অটো-ফিল
        if not validated_data.get('name'):
            full_name = f"{user.first_name} {user.last_name}".strip()
            validated_data['name'] = full_name or user.username or user.email or 'Doctor'
        if not validated_data.get('email'):
            validated_data['email'] = user.email or ''
        return super().create(validated_data)


# -------------------------
# Patient Serializer
# -------------------------
class PatientSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)

    class Meta:
        model = Patient
        fields = ['id', 'name', 'age', 'gender', 'email', 'phone', 'doctor', 'doctor_name']
        read_only_fields = ['id']


# -------------------------
# Family Member Serializer
# -------------------------
class FamilyMemberSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)

    class Meta:
        model = FamilyMember
        fields = ['id', 'name', 'relationship', 'patient', 'patient_name']
        read_only_fields = ['id']


# -------------------------
# Appointment Serializer
# -------------------------
class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    patient_name = serializers.CharField(source='patient.name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'doctor', 'doctor_name', 'patient', 'patient_name',
            'date', 'time', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# -------------------------
# Prescription Serializer
# -------------------------
class PrescriptionSerializer(serializers.ModelSerializer):
    appointment_info = AppointmentSerializer(source='appointment', read_only=True)

    class Meta:
        model = Prescription
        fields = ['id', 'appointment', 'appointment_info', 'medications', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']


# -------------------------
# Payment Serializer
# -------------------------
class PaymentSerializer(serializers.ModelSerializer):
    appointment_info = AppointmentSerializer(source='appointment', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'appointment', 'appointment_info', 'amount', 'payment_date', 'status']
        read_only_fields = ['id']


# -------------------------
# Doctor Availability Serializer
# -------------------------
class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)

    class Meta:
        model = DoctorAvailability
        fields = ['id', 'doctor', 'doctor_name', 'day_of_week', 'start_time', 'end_time']
        read_only_fields = ['id']
