from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),

    # Include core app API and pages
    path('', include('core.urls')),
    path('api/', include('appointments.urls')),
]
