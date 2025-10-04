from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.contrib import messages

from rest_framework import viewsets, status, serializers, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken


from .models import User
from rest_framework.renderers import JSONRenderer

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
# Django HTML Views
# -------------------------
def login_view(request):
    """Render login page and handle Django form login (optional)."""
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
    """Logout user and redirect to login page."""
    logout(request)
    return redirect("login_page")


def home_page(request):
    """Render home page for logged-in user."""
    return render(request, "core/home.html")


# -------------------------
# DRF ViewSets
# -------------------------
class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class DoctorProfileViewSet(viewsets.ModelViewSet):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.AllowAny]


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]


class FamilyMemberViewSet(viewsets.ModelViewSet):
    queryset = FamilyMember.objects.all()
    serializer_class = FamilyMemberSerializer
    permission_classes = [permissions.IsAuthenticated]


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]


class DoctorAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = DoctorAvailability.objects.all()
    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]


# -------------------------
# API Home (JSON response)
# -------------------------
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def home(request):
    """Return API running message (for React front-end)."""
    return Response({'message': 'DoctorAPS API is running!'})


# -------------------------
# DRF API - User Registration
# -------------------------
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    renderer_classes = [JSONRenderer]  # ensure JSON response

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")
        role = request.data.get("role", "patient")

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            role=role
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            "id": user.id,
            "username": user.username,
            "role": user.role,
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_201_CREATED)

# -------------------------
# DRF API - Doctor Registration
# -------------------------
class DoctorRegisterView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # must provide JWT

    def post(self, request):
        user_id = request.data.get("user_id")
        specialization = request.data.get("specialization", "General")
        consultation_fee = request.data.get("consultation_fee", 0)

        try:
            user = User.objects.get(id=user_id)
            doctor_profile = DoctorProfile.objects.create(
                user=user,
                specialization=specialization,
                consultation_fee=consultation_fee
            )
            serializer = DoctorProfileSerializer(doctor_profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# DRF API - Login with role
# -------------------------
class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        role = request.data.get("role")

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Optional role validation
        if hasattr(user, "role") and user.role != role:
            return Response({"error": "Role mismatch"}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)

        dashboard_map = {
            "doctor": "/dashboard/doctor",
            "patient": "/dashboard/patient",
            "agent": "/dashboard/agent",
            "management": "/dashboard/management",
            "admin": "/dashboard/admin",
        }

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "dashboard_url": dashboard_map.get(role, "/home"),
            "username": user.username,
            "role": getattr(user, "role", "")
        }, status=status.HTTP_200_OK)


# -------------------------
# Stats API
# -------------------------
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def stats_view(request):
    data = {
        "doctors": DoctorProfile.objects.count(),
        "patients": Patient.objects.count(),
        "appointments": Appointment.objects.count(),
        "prescriptions": Prescription.objects.count(),
    }
    return Response(data)
