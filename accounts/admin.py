from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, CookProfile, CustomerProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Custom admin for User model with approval actions."""
    
    list_display = ['username', 'email', 'role', 'phone', 'is_approved', 'is_active', 'date_joined']
    list_filter = ['role', 'is_approved', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'phone', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    fieldsets = UserAdmin.fieldsets + (
        ('HomeBite Profile', {
            'fields': ('role', 'phone', 'address', 'cnic', 'is_approved')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('HomeBite Profile', {
            'fields': ('role', 'phone', 'address', 'cnic')
        }),
    )
    
    actions = ['approve_users', 'reject_users', 'disable_users', 'enable_users']
    
    @admin.action(description='Approve selected users')
    def approve_users(self, request, queryset):
        updated = queryset.filter(role='cook').update(is_approved=True)
        self.message_user(request, f'{updated} cook(s) approved.')
    
    @admin.action(description='Reject selected users (set is_approved=False)')
    def reject_users(self, request, queryset):
        """Reject cooks and deactivate their meals."""
        from meals.models import Meal
        
        cook_users = queryset.filter(role='cook')
        for user in cook_users:
            user.is_approved = False
            user.save()
            # Deactivate all meals by this cook
            if hasattr(user, 'cook_profile'):
                Meal.objects.filter(cook=user.cook_profile).update(is_active=False)
        
        self.message_user(request, f'{cook_users.count()} cook(s) rejected and their meals deactivated.')
    
    @admin.action(description='Disable selected users')
    def disable_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} user(s) disabled.')
    
    @admin.action(description='Enable selected users')
    def enable_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} user(s) enabled.')


class CookProfileInline(admin.StackedInline):
    model = CookProfile
    can_delete = False


class CustomerProfileInline(admin.StackedInline):
    model = CustomerProfile
    can_delete = False


@admin.register(CookProfile)
class CookProfileAdmin(admin.ModelAdmin):
    """Admin for cook profiles."""
    
    list_display = ['user', 'kitchen_address', 'rating', 'total_orders', 'total_ratings']
    list_filter = ['rating']
    search_fields = ['user__username', 'user__email', 'kitchen_address']
    readonly_fields = ['rating', 'total_orders', 'total_ratings']


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    """Admin for customer profiles."""
    
    list_display = ['user', 'customer_type', 'location_address']
    list_filter = ['customer_type']
    search_fields = ['user__username', 'user__email', 'location_address']

