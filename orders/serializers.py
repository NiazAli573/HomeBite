from rest_framework import serializers
from .models import Order
from meals.serializers import MealListSerializer


class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.user.get_full_name', read_only=True)
    meal_details = MealListSerializer(source='meal', read_only=True)
    meal_id = serializers.PrimaryKeyRelatedField(
        queryset=Order.objects.none(),
        source='meal',
        write_only=True
    )

    class Meta:
        model = Order
        fields = [
            'id', 'customer', 'customer_name', 'meal', 'meal_details', 'meal_id',
            'cook', 'quantity', 'total_price', 'status', 'delivery_type',
            'payment_method', 'customer_phone', 'notes', 'rating', 'review',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'customer', 'cook', 'total_price', 'created_at', 'updated_at']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set queryset for meal_id field
        if 'request' in self.context:
            from meals.models import Meal
            self.fields['meal_id'].queryset = Meal.objects.filter(is_active=True, is_approved=True)

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            if hasattr(request.user, 'customer_profile'):
                validated_data['customer'] = request.user.customer_profile
                meal = validated_data['meal']
                validated_data['cook'] = meal.cook
                validated_data['customer_phone'] = request.user.phone
        return super().create(validated_data)


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'id', 'meal', 'quantity', 'delivery_type', 'payment_method', 'notes',
            'total_price', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'total_price', 'status', 'created_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            if hasattr(request.user, 'customer_profile'):
                validated_data['customer'] = request.user.customer_profile
                meal = validated_data['meal']
                validated_data['cook'] = meal.cook
                validated_data['customer_phone'] = request.user.phone
        return super().create(validated_data)
