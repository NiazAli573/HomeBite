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
    
    actions = ['disable_users', 'enable_users']
    
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

