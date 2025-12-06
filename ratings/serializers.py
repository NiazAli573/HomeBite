from rest_framework import serializers
from .models import Rating
from orders.models import Order


class RatingSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.user.get_full_name', read_only=True)
    meal_name = serializers.CharField(source='meal.name', read_only=True)
    cook_name = serializers.CharField(source='cook.user.get_full_name', read_only=True)
    
    class Meta:
        model = Rating
        fields = [
            'id', 'customer', 'customer_name', 'order', 'meal', 'meal_name',
            'cook', 'cook_name', 'meal_rating', 'cook_rating', 'comment',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'customer', 'meal', 'cook', 'created_at', 'updated_at']
    
    def validate_order(self, value):
        """Ensure order is completed and belongs to the customer."""
        request = self.context.get('request')
        
        if value.status != 'completed':
            raise serializers.ValidationError("Can only rate completed orders.")
        
        if request and hasattr(request.user, 'customer_profile'):
            if value.customer != request.user.customer_profile:
                raise serializers.ValidationError("You can only rate your own orders.")
        
        # Check if already rated
        if hasattr(value, 'rating_detail'):
            raise serializers.ValidationError("This order has already been rated.")
        
        return value
    
    def create(self, validated_data):
        """Auto-populate meal and cook from order."""
        order = validated_data['order']
        validated_data['meal'] = order.meal
        validated_data['cook'] = order.cook
        
        request = self.context.get('request')
        if request and hasattr(request.user, 'customer_profile'):
            validated_data['customer'] = request.user.customer_profile
        
        return super().create(validated_data)


class RatingCreateSerializer(serializers.Serializer):
    """Simplified serializer for rating creation."""
    order_id = serializers.IntegerField()
    meal_rating = serializers.IntegerField(min_value=1, max_value=5)
    cook_rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(required=False, allow_blank=True)
    
    def validate_order_id(self, value):
        """Validate order exists and is completed."""
        try:
            order = Order.objects.get(pk=value)
        except Order.DoesNotExist:
            raise serializers.ValidationError("Order not found.")
        
        if order.status != 'completed':
            raise serializers.ValidationError("Can only rate completed orders.")
        
        request = self.context.get('request')
        if request and hasattr(request.user, 'customer_profile'):
            if order.customer != request.user.customer_profile:
                raise serializers.ValidationError("You can only rate your own orders.")
        
        if hasattr(order, 'rating_detail'):
            raise serializers.ValidationError("This order has already been rated.")
        
        return value
    
    def create(self, validated_data):
        """Create rating from validated data."""
        order = Order.objects.get(pk=validated_data['order_id'])
        request = self.context.get('request')
        
        rating = Rating.objects.create(
            customer=request.user.customer_profile,
            order=order,
            meal=order.meal,
            cook=order.cook,
            meal_rating=validated_data['meal_rating'],
            cook_rating=validated_data['cook_rating'],
            comment=validated_data.get('comment', '')
        )
        
        return rating
