from django.contrib import admin
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin for orders with status management."""
    
    list_display = [
        'order_id', 'customer', 'meal', 'cook', 'quantity', 
        'total_price', 'status', 'delivery_type', 'created_at'
    ]
    list_filter = ['status', 'delivery_type', 'payment_method', 'created_at']
    search_fields = [
        'customer__user__username', 'cook__user__username', 
        'meal__name', 'customer_phone'
    ]
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'order_id']
    
    fieldsets = (
        ('Order Info', {
            'fields': ('order_id', 'customer', 'meal', 'cook')
        }),
        ('Order Details', {
            'fields': ('quantity', 'total_price', 'delivery_type', 'payment_method')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Contact', {
            'fields': ('customer_phone', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_confirmed', 'mark_ready', 'mark_completed', 'mark_cancelled']
    
    @admin.action(description='Mark selected orders as confirmed')
    def mark_confirmed(self, request, queryset):
        updated = queryset.filter(status='pending').update(status='confirmed')
        self.message_user(request, f'{updated} order(s) confirmed.')
    
    @admin.action(description='Mark selected orders as ready')
    def mark_ready(self, request, queryset):
        updated = queryset.filter(status__in=['pending', 'confirmed']).update(status='ready')
        self.message_user(request, f'{updated} order(s) marked as ready.')
    
    @admin.action(description='Mark selected orders as completed')
    def mark_completed(self, request, queryset):
        for order in queryset.filter(status='ready'):
            order.mark_as_completed()
        self.message_user(request, 'Orders marked as completed.')
    
    @admin.action(description='Cancel selected orders')
    def mark_cancelled(self, request, queryset):
        count = 0
        for order in queryset.filter(status__in=['pending', 'confirmed']):
            if order.cancel():
                count += 1
        self.message_user(request, f'{count} order(s) cancelled.')

