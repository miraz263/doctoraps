# core/middleware.py
from django.shortcuts import get_object_or_404
from .models import Tenant

class TenantMiddleware:
    """
    Resolve tenant based on URL prefix: /<tenant_slug>/api/...
    Sets request.tenant or None.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path_info  # e.g. /clinic1/api/appointments/
        parts = [p for p in path.split('/') if p]
        tenant = None
        if parts:
            # assume first part is tenant_slug unless it's admin or other paths
            candidate = parts[0]
            if candidate not in ('admin', 'api', 'static', 'media'):
                try:
                    tenant = Tenant.objects.get(slug=candidate)
                except Tenant.DoesNotExist:
                    tenant = None
        request.tenant = tenant
        return self.get_response(request)
