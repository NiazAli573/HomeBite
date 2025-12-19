from django.urls import path
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from . import api_views


@ensure_csrf_cookie
def get_csrf_token(request):
    """Get CSRF token for the frontend"""
    return JsonResponse({'detail': 'CSRF cookie set'})


app_name = 'api_accounts'

urlpatterns = [
    path('csrf/', get_csrf_token, name='csrf'),
    path('user/', api_views.current_user, name='current_user'),
    path('login/', api_views.login_view, name='login'),
    path('logout/', api_views.logout_view, name='logout'),
    path('signup/customer/', api_views.customer_signup, name='customer_signup'),
    path('signup/cook/', api_views.cook_signup, name='cook_signup'),
    path('profile/', api_views.profile_view, name='profile'),
    # Admin cook approval endpoints
    path('admin/pending-cooks/', api_views.pending_cooks, name='pending_cooks'),
    path('admin/approve-cook/', api_views.approve_cook, name='approve_cook'),
    path('admin/disapprove-cook/', api_views.disapprove_cook, name='disapprove_cook'),
]
