from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from django.db.models import Sum, Count, Q
from orders.models import Order


@login_required
def cook_dashboard(request):
    """Main dashboard for cooks showing today's orders and stats."""
    
    if not request.user.is_cook:
        messages.error(request, 'Only cooks can access the dashboard.')
        return redirect('home')
    
    cook_profile = request.user.cook_profile
    today = timezone.now().date()
    
    # Get today's orders
    todays_orders = Order.objects.filter(
        cook=cook_profile,
        created_at__date=today
    ).select_related('customer', 'customer__user', 'meal').order_by('-created_at')
    
    # Calculate today's stats
    todays_stats = todays_orders.aggregate(
        total_orders=Count('id'),
        total_earnings=Sum('total_price'),
        pending_count=Count('id', filter=Q(status='pending')),
        ready_count=Count('id', filter=Q(status='ready')),
        completed_count=Count('id', filter=Q(status='completed')),
    )
    
    # Get all-time stats
    all_stats = {
        'total_orders': cook_profile.total_orders,
        'rating': cook_profile.rating,
        'total_ratings': cook_profile.total_ratings,
    }
    
    context = {
        'orders': todays_orders,
        'todays_stats': todays_stats,
        'all_stats': all_stats,
        'today': today,
    }
    
    return render(request, 'dashboard/cook_dashboard.html', context)


@login_required
def mark_order_ready(request, pk):
    """Mark an order as ready for pickup."""
    
    if not request.user.is_cook:
        messages.error(request, 'Only cooks can update orders.')
        return redirect('home')
    
    order = get_object_or_404(Order, pk=pk, cook=request.user.cook_profile)
    
    if order.status in ['pending', 'confirmed']:
        order.mark_as_ready()
        messages.success(request, f'Order #{order.order_id} marked as ready!')
    else:
        messages.warning(request, 'Order cannot be marked as ready.')
    
    return redirect('dashboard:cook_dashboard')


@login_required
def mark_order_completed(request, pk):
    """Mark an order as completed."""
    
    if not request.user.is_cook:
        messages.error(request, 'Only cooks can update orders.')
        return redirect('home')
    
    order = get_object_or_404(Order, pk=pk, cook=request.user.cook_profile)
    
    if order.status == 'ready':
        order.mark_as_completed()
        messages.success(request, f'Order #{order.order_id} completed!')
    else:
        messages.warning(request, 'Order must be ready before completing.')
    
    return redirect('dashboard:cook_dashboard')


@login_required
def order_history_cook(request):
    """View all past orders for a cook."""
    
    if not request.user.is_cook:
        messages.error(request, 'Only cooks can access this page.')
        return redirect('home')
    
    orders = Order.objects.filter(
        cook=request.user.cook_profile
    ).select_related('customer', 'customer__user', 'meal').order_by('-created_at')
    
    return render(request, 'dashboard/order_history.html', {'orders': orders})

