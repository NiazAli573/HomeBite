from django.urls import path
from . import views

app_name = 'orders'

urlpatterns = [
    path('place/<int:meal_id>/', views.place_order, name='place'),
    path('<int:pk>/confirmation/', views.order_confirmation, name='confirmation'),
    path('history/', views.order_history, name='history'),
    path('<int:pk>/', views.order_detail, name='detail'),
    path('<int:pk>/rate/', views.rate_order, name='rate'),
    path('<int:pk>/cancel/', views.cancel_order, name='cancel'),
]
