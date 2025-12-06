from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('', views.cook_dashboard, name='cook_dashboard'),
    path('order/<int:pk>/ready/', views.mark_order_ready, name='mark_ready'),
    path('order/<int:pk>/completed/', views.mark_order_completed, name='mark_completed'),
    path('orders/history/', views.order_history_cook, name='order_history'),
]
