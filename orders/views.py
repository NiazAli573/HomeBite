from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import HttpResponseForbidden
from .models import Order
from .forms import PlaceOrderForm, OrderRatingForm
from meals.models import Meal
from accounts.models import CustomerProfile


@login_required
def place_order(request, meal_id):
    """Place an order for a specific meal."""
    
    if not request.user.is_customer:
        messages.error(request, 'Only customers can place orders.')
        return redirect('meals:browse')
    
    meal = get_object_or_404(
        Meal, 
        pk=meal_id, 
        is_active=True, 
        is_approved=True,
        quantity_available__gt=0
    )
    
    # Get or create customer profile
    profile, created = CustomerProfile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
        form = PlaceOrderForm(request.POST, meal=meal)
        if form.is_valid():
            quantity = form.cleaned_data['quantity']
            
            # Check availability again
            if quantity > meal.quantity_available:
                messages.error(request, 'Not enough quantity available.')
                return redirect('meals:detail', pk=meal_id)
            
            # Create order
            order = Order.objects.create(
                customer=profile,
                meal=meal,
                cook=meal.cook,
                quantity=quantity,
                delivery_type=form.cleaned_data['delivery_type'],
                customer_phone=form.cleaned_data['customer_phone'],
                notes=form.cleaned_data.get('notes', ''),
                total_price=meal.price * quantity,
                status='pending'
            )
            
            # Reduce meal quantity
            meal.reduce_quantity(quantity)
            
            messages.success(request, 'Order placed successfully!')
            return redirect('orders:confirmation', pk=order.pk)
    else:
        initial = {'customer_phone': request.user.phone}
        form = PlaceOrderForm(initial=initial, meal=meal)
    
    context = {
        'form': form,
        'meal': meal,
    }
    
    return render(request, 'orders/place_order.html', context)


@login_required
def order_confirmation(request, pk):
    """Display order confirmation page."""
    
    order = get_object_or_404(Order, pk=pk)
    
    # Verify the order belongs to the current user
    if order.customer.user != request.user:
        return HttpResponseForbidden('You do not have permission to view this order.')
    
    return render(request, 'orders/confirmation.html', {'order': order})


@login_required
def order_history(request):
    """Display customer's order history."""
    
    if not request.user.is_customer:
        messages.error(request, 'Only customers can view order history.')
        return redirect('home')
    
    profile, _ = CustomerProfile.objects.get_or_create(user=request.user)
    orders = Order.objects.filter(customer=profile).select_related('meal', 'cook', 'cook__user')
    
    return render(request, 'orders/history.html', {'orders': orders})


@login_required
def order_detail(request, pk):
    """Display detailed order information."""
    
    order = get_object_or_404(Order, pk=pk)
    
    # Check permissions
    is_owner = (
        (request.user.is_customer and order.customer.user == request.user) or
        (request.user.is_cook and order.cook.user == request.user)
    )
    
    if not is_owner and not request.user.is_admin_user:
        return HttpResponseForbidden('You do not have permission to view this order.')
    
    return render(request, 'orders/detail.html', {'order': order})


@login_required
def rate_order(request, pk):
    """Rate a completed order."""
    
    order = get_object_or_404(Order, pk=pk, customer__user=request.user, status='completed')
    
    if request.method == 'POST':
        form = OrderRatingForm(request.POST)
        if form.is_valid():
            rating = form.cleaned_data['rating']
            order.cook.update_rating(rating)
            messages.success(request, 'Thank you for your rating!')
            return redirect('orders:history')
    else:
        form = OrderRatingForm()
    
    return render(request, 'orders/rate.html', {'form': form, 'order': order})


@login_required
def cancel_order(request, pk):
    """Cancel a pending order."""
    
    order = get_object_or_404(Order, pk=pk, customer__user=request.user)
    
    if order.status not in ['pending', 'confirmed']:
        messages.error(request, 'This order cannot be cancelled.')
        return redirect('orders:detail', pk=pk)
    
    if request.method == 'POST':
        if order.cancel():
            messages.success(request, 'Order cancelled successfully.')
            return redirect('orders:history')
        else:
            messages.error(request, 'Failed to cancel order.')
    
    return render(request, 'orders/cancel_confirm.html', {'order': order})

