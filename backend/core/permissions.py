# core/permissions.py
from rest_framework.permissions import BasePermission

class IsTenantPresent(BasePermission):
    """
    Ensure middleware set request.tenant (tenant must be present in URL).
    """
    message = "Tenant not found in URL."

    def has_permission(self, request, view):
        return getattr(request, 'tenant', None) is not None
