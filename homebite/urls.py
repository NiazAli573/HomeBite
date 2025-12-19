"""
URL configuration for HomeBite project.

HomeBite - Hyperlocal home-cooked meals marketplace
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from meals.api_views import MealViewSet
from orders.api_views import OrderViewSet

# API Router
router = DefaultRouter()
router.register(r'meals', MealViewSet, basename='meal')
router.register(r'orders', OrderViewSet, basename='order')

from django.http import JsonResponse

def api_root(request):
    """API root endpoint"""
    return JsonResponse({
        'message': 'HomeBite API',
        'version': '1.0',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'auth': '/api/auth/',
            'meals': '/api/meals/',
            'orders': '/api/orders/',
        },
        'frontend': 'http://localhost:3000'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    # API endpoints
    path('api/auth/', include('accounts.api_urls')),
    path('api/dashboard/', include('dashboard.api_urls')),
    path('api/analytics/', include('analytics.api_urls')),
    path('api/', include(router.urls)),
    # API root
    path('', api_root, name='api_root'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Custom admin site configuration
admin.site.site_header = 'HomeBite Administration'
admin.site.site_title = 'HomeBite Admin'
admin.site.index_title = 'Dashboard'
