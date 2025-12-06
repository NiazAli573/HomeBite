from django.contrib import admin
from .models import Meal


@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    """Admin for meal listings with approval actions."""
    
    list_display = ['name', 'cook', 'price', 'quantity_available', 'ready_time', 'is_approved', 'is_active', 'created_at']
    list_filter = ['is_approved', 'is_active', 'created_at']
    search_fields = ['name', 'description', 'cook__user__username']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        (None, {
            'fields': ('cook', 'name', 'description', 'photo')
        }),
        ('Pricing & Availability', {
            'fields': ('price', 'quantity_available', 'ready_time')
        }),
        ('Status', {
            'fields': ('is_approved', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_meals', 'reject_meals', 'disable_meals', 'enable_meals']
    
    @admin.action(description='Approve selected meals')
    def approve_meals(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} meal(s) approved.')
    
    @admin.action(description='Reject selected meals (set is_approved=False)')
    def reject_meals(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f'{updated} meal(s) rejected.')
    
    @admin.action(description='Disable selected meals')
    def disable_meals(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} meal(s) disabled.')
    
    @admin.action(description='Enable selected meals')
    def enable_meals(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} meal(s) enabled.')

