from django.urls import path
from .api_views import admin_analytics

urlpatterns = [
    path('stats/', admin_analytics, name='admin-analytics'),
]
