from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse

from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token


from .models import (
    Tenant, User, DoctorProfile, Patient, FamilyMember,
    Appointment, Prescription, Payment, DoctorAvailability
)
from .serializers import (
    TenantSerializer, UserSerializer, DoctorProfileSerializer,
    PatientSerializer, FamilyMemberSerializer, AppointmentSerializer,
    PrescriptionSerializer, PaymentSerializer, DoctorAvailabilitySerializer
)

# -------------------------
# DRF ViewSets
# -------------------------
class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class DoctorProfileViewSet(viewsets.ModelViewSet):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [AllowAny]

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

class FamilyMemberViewSet(viewsets.ModelViewSet):
    queryset = FamilyMember.objects.all()
    serializer_class = FamilyMemberSerializer
    permission_classes = [IsAuthenticated]

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

class DoctorAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = DoctorAvailability.objects.all()
    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [IsAuthenticated]

# -------------------------
# API Home
# -------------------------
def home(request):
    return JsonResponse({'message': 'DoctorAPS API is running!'})

# -------------------------
# Django Auth Views
# -------------------------
def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect("home_page")
        messages.error(request, "Invalid username or password")
    return render(request, "core/login.html")

def logout_view(request):
    logout(request)
    return redirect("login_page")

def home_page(request):
    return render(request, "core/home.html")

# -------------------------
# DRF API - User Registration
# -------------------------
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "User registered successfully",
            "user": {"username": user.username, "email": user.email},
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_201_CREATED)

# -------------------------
# Serializer for Doctor Registration
# -------------------------
class DoctorRegisterSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    specialization = serializers.CharField(max_length=255)
    consultation_fee = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)

    def validate_user_id(self, value):
        if not User.objects.filter(id=value).exists():
            raise serializers.ValidationError("User not found.")
        return value

# -------------------------
# DRF API - Doctor Registration
# -------------------------
class DoctorRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get("user_id")
        specialization = request.data.get("specialization")
        consultation_fee = request.data.get("consultation_fee", 0)

        if not user_id or not specialization:
            return Response(
                {"error": "User ID and specialization are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if DoctorProfile.objects.filter(user=user).exists():
            return Response(
                {"error": "Doctor profile for this user already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            doctor = DoctorProfile.objects.create(
                user=user,
                specialization=specialization,
                consultation_fee=consultation_fee,
            )
        except Exception as e:
            return Response({"error": f"Doctor creation failed: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = DoctorProfileSerializer(doctor)
        return Response({"message": "Doctor registered successfully", "doctor": serializer.data}, status=status.HTTP_201_CREATED)

# -------------------------
# DRF API - Login with role
# -------------------------
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        role = request.data.get("role")

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({"error": "Invalid credentials"}, status=401)

        # Role check (optional)
        if hasattr(user, "role") and user.role != role:
            return Response({"error": "Role mismatch"}, status=400)

        # Generate JWT
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Role-based dashboard
        dashboard_map = {
            "doctor": "/dashboard/doctor",
            "patient": "/dashboard/patient",
            "agent": "/dashboard/agent",
            "management": "/dashboard/management",
            "admin": "/dashboard/admin",
        }

        return Response({
            "token": access_token,
            "dashboard_url": dashboard_map.get(role, "/dashboard"),
            "username": user.username
        }, status=200)


# -------------------------
# Dashboard Stats API
# -------------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def stats_view(request):
    data = {
        "doctors": DoctorProfile.objects.count(),
        "patients": Patient.objects.count(),
        "appointments": Appointment.objects.count(),
        "prescriptions": Prescription.objects.count(),
    }
    return Response(data)
