from django.contrib import admin
from .models import Rating


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'meal', 'meal_rating', 'cook_rating', 'created_at']
    list_filter = ['meal_rating', 'cook_rating', 'created_at']
    search_fields = ['customer__user__username', 'cook__user__username', 'meal__name']
    readonly_fields = ['created_at', 'updated_at']
