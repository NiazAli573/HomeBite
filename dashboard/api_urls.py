from django.urls import path
from . import api_views

urlpatterns = [
    # Cook dashboard
    path('cook/stats/', api_views.cook_dashboard_stats, name='cook_dashboard_stats'),
    path('cook/todays-orders/', api_views.cook_todays_orders, name='cook_todays_orders'),
    
    # Customer dashboard
    path('customer/stats/', api_views.customer_dashboard_stats, name='customer_dashboard_stats'),
]
