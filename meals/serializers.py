from rest_framework import serializers
from .models import Meal


class MealSerializer(serializers.ModelSerializer):
    cook_name = serializers.CharField(source='cook.user.get_full_name', read_only=True)
    cook_rating = serializers.DecimalField(source='cook.rating', max_digits=2, decimal_places=1, read_only=True)
    cook_address = serializers.CharField(source='cook.kitchen_address', read_only=True)
    is_available = serializers.BooleanField(read_only=True)
    average_meal_rating = serializers.FloatField(read_only=True)
    total_meal_ratings = serializers.IntegerField(read_only=True)
    distance_km = serializers.FloatField(read_only=True, required=False)

    class Meta:
        model = Meal
        fields = [
            'id', 'cook', 'name', 'description', 'photo', 'price',
            'quantity_available', 'ready_time', 'is_approved', 'is_active',
            'is_available', 'cook_name', 'cook_rating', 'cook_address',
            'dine_with_us_available', 'dine_price',
            'average_meal_rating', 'total_meal_ratings', 'distance_km',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'cook', 'is_approved', 'created_at', 'updated_at']


class MealListSerializer(serializers.ModelSerializer):
    cook_name = serializers.CharField(source='cook.user.get_full_name', read_only=True)
    cook_rating = serializers.DecimalField(source='cook.rating', max_digits=2, decimal_places=1, read_only=True)
    cook_address = serializers.CharField(source='cook.kitchen_address', read_only=True)
    is_available = serializers.BooleanField(read_only=True)
    average_meal_rating = serializers.FloatField(read_only=True)
    distance_km = serializers.FloatField(read_only=True, required=False)

    class Meta:
        model = Meal
        fields = [
            'id', 'name', 'description', 'photo', 'price',
            'quantity_available', 'ready_time', 'is_available',
            'cook_name', 'cook_rating', 'cook_address',
            'dine_with_us_available', 'dine_price',
            'average_meal_rating', 'distance_km'
        ]
