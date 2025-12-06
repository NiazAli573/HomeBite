from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib import messages
from django.urls import reverse_lazy
from django.views.generic import CreateView, UpdateView, TemplateView
from .models import User, CookProfile, CustomerProfile
from .forms import (
    CustomerSignupForm, CookSignupForm, LoginForm,
    CustomerProfileForm, CookProfileForm, UserProfileForm
)


class CustomerSignupView(CreateView):
    """View for customer registration."""
    
    template_name = 'accounts/customer_signup.html'
    form_class = CustomerSignupForm
    success_url = reverse_lazy('accounts:login')
    
    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, 'Account created successfully! Please login.')
        return response


class CookSignupView(CreateView):
    """View for cook registration."""
    
    template_name = 'accounts/cook_signup.html'
    form_class = CookSignupForm
    success_url = reverse_lazy('accounts:login')
    
    def form_valid(self, form):
        response = super().form_valid(form)
        messages.info(
            self.request,
            'Account created! Your account is pending admin approval. '
            'You will be able to login once approved.'
        )
        return response


class CustomLoginView(LoginView):
    """Custom login view with role-based redirects."""
    
    template_name = 'accounts/login.html'
    form_class = LoginForm
    
    def form_valid(self, form):
        user = form.get_user()
        
        # Check if cook is approved
        if user.role == 'cook' and not user.is_approved:
            messages.error(
                self.request,
                'Your account is pending admin approval. Please wait for approval.'
            )
            return self.form_invalid(form)
        
        return super().form_valid(form)
    
    def get_success_url(self):
        user = self.request.user
        if user.is_cook:
            return reverse_lazy('dashboard:cook_dashboard')
        elif user.is_admin_user:
            return reverse_lazy('admin:index')
        return reverse_lazy('meals:browse')


class CustomLogoutView(LogoutView):
    """Custom logout view."""
    
    next_page = 'home'
    
    def dispatch(self, request, *args, **kwargs):
        messages.info(request, 'You have been logged out.')
        return super().dispatch(request, *args, **kwargs)


@login_required
def profile_view(request):
    """View and edit user profile."""
    
    user = request.user
    
    if request.method == 'POST':
        user_form = UserProfileForm(request.POST, instance=user)
        
        if user.is_cook:
            profile_form = CookProfileForm(request.POST, instance=user.cook_profile)
        else:
            profile_form = CustomerProfileForm(request.POST, instance=user.customer_profile)
        
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('accounts:profile')
    else:
        user_form = UserProfileForm(instance=user)
        
        if user.is_cook:
            profile_form = CookProfileForm(instance=user.cook_profile)
        else:
            # Create customer profile if it doesn't exist
            profile, _ = CustomerProfile.objects.get_or_create(user=user)
            profile_form = CustomerProfileForm(instance=profile)
    
    context = {
        'user_form': user_form,
        'profile_form': profile_form,
    }
    
    return render(request, 'accounts/profile.html', context)


def signup_choice_view(request):
    """View for choosing between customer and cook signup."""
    return render(request, 'accounts/signup_choice.html')

