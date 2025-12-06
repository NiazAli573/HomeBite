from django.urls import path
from . import views

app_name = 'meals'

urlpatterns = [
    path('', views.browse_meals, name='browse'),
    path('<int:pk>/', views.meal_detail, name='detail'),
    path('my-meals/', views.my_meals, name='my_meals'),
    path('create/', views.create_meal, name='create'),
    path('<int:pk>/edit/', views.edit_meal, name='edit'),
    path('<int:pk>/delete/', views.delete_meal, name='delete'),
]
