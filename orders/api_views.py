from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer, OrderCreateSerializer


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'cook' and hasattr(user, 'cook_profile'):
            # Cooks see orders for their meals
            return Order.objects.filter(cook=user.cook_profile).select_related('customer', 'meal', 'cook')
        elif user.role == 'customer' and hasattr(user, 'customer_profile'):
            # Customers see their own orders
            return Order.objects.filter(customer=user.customer_profile).select_related('meal', 'cook')
        # Return empty queryset for users without profiles
        return Order.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        """Create order with inventory validation."""
        meal = serializer.validated_data['meal']
        quantity = serializer.validated_data['quantity']
        delivery_type = serializer.validated_data.get('delivery_type', 'pickup')
        
        # Check if meal is available
        if not meal.is_available:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'meal': 'This meal is not available for ordering.'})
        
        # For non-dine-in orders, validate quantity
        if delivery_type != 'dine_in':
            if quantity > meal.quantity_available:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({
                    'quantity': f'Only {meal.quantity_available} portions available. You requested {quantity}.'
                })
        
        # Calculate price based on delivery type
        if delivery_type == 'dine_in' and meal.dine_with_us_available:
            price_per_unit = meal.dine_price if meal.dine_price else meal.price
        else:
            price_per_unit = meal.price
        
        total_price = price_per_unit * quantity
        
        # Create order with total_price
        order = serializer.save(total_price=total_price)
        
        # Reduce meal quantity (only for pickup/delivery, not dine-in)
        if delivery_type != 'dine_in':
            meal.reduce_quantity(quantity)

    @action(detail=False, methods=['get'])
    def history(self, request):
        """Get order history for current user"""
        orders = self.get_queryset().order_by('-created_at')
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an order"""
        order = self.get_object()
        
        if not hasattr(request.user, 'customer_profile') or order.customer != request.user.customer_profile:
            return Response(
                {'error': 'You can only cancel your own orders'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if order.status in ['completed', 'cancelled']:
            return Response(
                {'error': 'Cannot cancel completed or already cancelled orders'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.cancel()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark order as completed (cook only)."""
        order = self.get_object()
        
        if not hasattr(request.user, 'cook_profile') or order.cook != request.user.cook_profile:
            return Response(
                {'error': 'Only the cook can complete orders'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if order.mark_as_completed():
            serializer = self.get_serializer(order)
            return Response(serializer.data)
        
        return Response(
            {'error': 'Order cannot be completed in current status'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active orders (pending only) for current user."""
        orders = self.get_queryset().filter(
            status='pending'
        ).order_by('-created_at')
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def completed(self, request):
        """Get completed orders for current user."""
        orders = self.get_queryset().filter(status='completed').order_by('-created_at')
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update order status (cook only) - Generic method."""
        order = self.get_object()
        
        if not hasattr(request.user, 'cook_profile') or order.cook != request.user.cook_profile:
            return Response(
                {'error': 'Only the cook can update order status'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        new_status = request.data.get('status')
        valid_statuses = dict(Order.STATUS_CHOICES).keys()
        if new_status not in valid_statuses:
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        if new_status == 'completed':
            order.mark_as_completed()
        else:
            order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
