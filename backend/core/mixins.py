# core/mixins.py
class TenantQuerysetMixin:
    """
    Filter queryset by request.tenant (assumes model has tenant FK named 'tenant').
    Use in viewsets: queryset = Model.objects.all(); add this mixin to filter.
    """
    def get_queryset(self):
        qs = super().get_queryset()
        tenant = getattr(self.request, 'tenant', None)
        if tenant is None:
            return qs.none()
        return qs.filter(tenant=tenant)
