from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db.models import Sum, Count, Q, Avg
from orders.models import Order
from orders.serializers import OrderSerializer
from meals.models import Meal
from decimal import Decimal


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cook_dashboard_stats(request):
    """Get dashboard statistics for cook."""
    if request.user.role != 'cook':
        return Response(
            {'error': 'Only cooks can access dashboard stats. Your account role is: ' + request.user.role},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if not hasattr(request.user, 'cook_profile'):
        return Response(
            {'error': 'Cook profile not found. Please contact support.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    cook_profile = request.user.cook_profile
    today = timezone.now().date()
    
    # Get today's orders (created today, any status)
    todays_orders = Order.objects.filter(
        cook=cook_profile,
        created_at__date=today
    )
    
    # Get today's completed orders for today's earnings
    todays_completed_orders = todays_orders.filter(status='completed')
    
    # Today's stats
    todays_stats = {
        'total_orders': todays_orders.count(),
        'total_earnings': float(todays_completed_orders.aggregate(Sum('total_price'))['total_price__sum'] or 0),
        'pending_count': todays_orders.filter(status='pending').count(),
        'confirmed_count': todays_orders.filter(status='confirmed').count(),
        'ready_count': todays_orders.filter(status='ready').count(),
        'completed_count': todays_completed_orders.count(),
        'cancelled_count': todays_orders.filter(status='cancelled').count(),
    }
    
    # All-time stats
    all_time_stats = {
        'total_orders': cook_profile.total_orders,
        'rating': float(cook_profile.rating),
        'total_ratings': cook_profile.total_ratings,
    }
    
    # Active meals count
    active_meals = Meal.objects.filter(
        cook=cook_profile,
        is_active=True
    ).count()
    
    return Response({
        'today': todays_stats,
        'all_time': all_time_stats,
        'active_meals_count': active_meals,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cook_todays_orders(request):
    """Get today's orders for cook, grouped by status."""
    if request.user.role != 'cook':
        return Response(
            {'error': 'Only cooks can access orders. Your account role is: ' + request.user.role},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if not hasattr(request.user, 'cook_profile'):
        return Response(
            {'error': 'Cook profile not found. Please contact support.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    cook_profile = request.user.cook_profile
    
    # Get orders by status (all pending/confirmed/ready orders, not just today)
    pending_orders = Order.objects.filter(
        cook=cook_profile,
        status='pending'
    ).select_related('customer__user', 'meal').order_by('-created_at')
    
    confirmed_orders = Order.objects.filter(
        cook=cook_profile,
        status='confirmed'
    ).select_related('customer__user', 'meal').order_by('-created_at')
    
    ready_orders = Order.objects.filter(
        cook=cook_profile,
        status='ready'
    ).select_related('customer__user', 'meal').order_by('-created_at')
    
    completed_orders = Order.objects.filter(
        cook=cook_profile,
        status='completed'
    ).select_related('customer__user', 'meal').order_by('-created_at')
    
    return Response({
        'pending': OrderSerializer(pending_orders, many=True).data,
        'confirmed': OrderSerializer(confirmed_orders, many=True).data,
        'ready': OrderSerializer(ready_orders, many=True).data,
        'completed': OrderSerializer(completed_orders, many=True).data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customer_dashboard_stats(request):
    """Get dashboard statistics for customer."""
    if request.user.role != 'customer' or not hasattr(request.user, 'customer_profile'):
        return Response(
            {'error': 'Only customers can access customer stats'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    customer_profile = request.user.customer_profile
    
    # Get order counts
    active_count = Order.objects.filter(
        customer=customer_profile,
        status__in=['pending', 'confirmed', 'ready']
    ).count()
    
    completed_count = Order.objects.filter(
        customer=customer_profile,
        status='completed'
    ).count()
    
    # Orders that can be rated
    rateable_count = Order.objects.filter(
        customer=customer_profile,
        status='completed',
        rating_detail__isnull=True
    ).count()
    
    # Total spent
    total_spent = Order.objects.filter(
        customer=customer_profile,
        status='completed'
    ).aggregate(total=Sum('total_price'))['total'] or Decimal('0')
    
    return Response({
        'active_orders': active_count,
        'completed_orders': completed_count,
        'orders_to_rate': rateable_count,
        'total_spent': float(total_spent),
    })
