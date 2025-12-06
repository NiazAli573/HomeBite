from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('signup/', views.signup_choice_view, name='signup_choice'),
    path('signup/customer/', views.CustomerSignupView.as_view(), name='customer_signup'),
    path('signup/cook/', views.CookSignupView.as_view(), name='cook_signup'),
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', views.CustomLogoutView.as_view(), name='logout'),
    path('profile/', views.profile_view, name='profile'),
]
