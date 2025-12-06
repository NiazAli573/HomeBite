from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from django.conf import settings
import math
from .models import Meal
from .forms import MealForm, MealFilterForm
from accounts.models import CookProfile, CustomerProfile


def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees) using Haversine formula.
    Returns distance in kilometers, or None if invalid coordinates.
    """
    try:
        # Validate and convert to float
        lat1 = float(lat1) if lat1 is not None else None
        lon1 = float(lon1) if lon1 is not None else None
        lat2 = float(lat2) if lat2 is not None else None
        lon2 = float(lon2) if lon2 is not None else None
        
        # Check for None values
        if None in (lat1, lon1, lat2, lon2):
            return None
        
        # Convert decimal degrees to radians
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        # Radius of earth in kilometers
        r = 6371
        
        return c * r
    except (ValueError, TypeError):
        return None


def browse_meals(request):
    """Browse available meals with filtering and sorting."""
    
    form = MealFilterForm(request.GET)
    
    # Get customer location
    customer_lat = None
    customer_lng = None
    
    if request.user.is_authenticated and hasattr(request.user, 'customer_profile'):
        profile = request.user.customer_profile
        customer_lat = profile.office_location_lat
        customer_lng = profile.office_location_lng
    
    # Override with query params if provided
    if request.GET.get('lat') and request.GET.get('lng'):
        try:
            customer_lat = float(request.GET.get('lat'))
            customer_lng = float(request.GET.get('lng'))
        except (ValueError, TypeError):
            pass
    
    # Get all available meals
    meals = Meal.objects.filter(
        is_active=True,
        is_approved=True,
        quantity_available__gt=0,
        cook__user__is_approved=True,
        cook__user__is_active=True
    ).select_related('cook', 'cook__user')
    
    # Apply search filter
    search_query = request.GET.get('search', '').strip()
    if search_query:
        meals = meals.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(cook__user__username__icontains=search_query)
        )
    
    # Apply price filter
    max_price = request.GET.get('max_price')
    if max_price:
        try:
            meals = meals.filter(price__lte=float(max_price))
        except (ValueError, TypeError):
            pass
    
    # Calculate distances and filter by distance
    meals_with_distance = []
    try:
        max_distance = float(request.GET.get('max_distance', settings.DEFAULT_SEARCH_RADIUS_KM))
    except (ValueError, TypeError):
        max_distance = settings.DEFAULT_SEARCH_RADIUS_KM
    
    for meal in meals:
        if customer_lat and customer_lng and meal.cook.kitchen_location_lat and meal.cook.kitchen_location_lng:
            distance = haversine_distance(
                customer_lat, customer_lng,
                meal.cook.kitchen_location_lat, meal.cook.kitchen_location_lng
            )
            if distance is not None and distance <= max_distance:
                meals_with_distance.append({
                    'meal': meal,
                    'distance': round(distance, 2)
                })
            elif distance is None:
                # Invalid coordinates, include without distance
                meals_with_distance.append({
                    'meal': meal,
                    'distance': None
                })
        else:
            # If no location data, include with None distance
            meals_with_distance.append({
                'meal': meal,
                'distance': None
            })
    
    # Apply sorting
    sort_by = request.GET.get('sort_by', 'distance')
    
    if sort_by == 'distance':
        meals_with_distance.sort(key=lambda x: (x['distance'] is None, x['distance'] or 0))
    elif sort_by == 'price_low':
        meals_with_distance.sort(key=lambda x: x['meal'].price)
    elif sort_by == 'price_high':
        meals_with_distance.sort(key=lambda x: x['meal'].price, reverse=True)
    elif sort_by == 'rating':
        meals_with_distance.sort(key=lambda x: x['meal'].cook.rating, reverse=True)
    
    context = {
        'meals': meals_with_distance,
        'form': form,
        'customer_lat': customer_lat,
        'customer_lng': customer_lng,
        'has_location': customer_lat is not None and customer_lng is not None,
    }
    
    return render(request, 'meals/browse.html', context)


def meal_detail(request, pk):
    """View detailed information about a specific meal."""
    
    meal = get_object_or_404(Meal, pk=pk, is_active=True, is_approved=True)
    
    # Calculate distance if user has location
    distance = None
    if request.user.is_authenticated and hasattr(request.user, 'customer_profile'):
        profile = request.user.customer_profile
        if profile.office_location_lat and profile.office_location_lng:
            if meal.cook.kitchen_location_lat and meal.cook.kitchen_location_lng:
                distance = haversine_distance(
                    profile.office_location_lat, profile.office_location_lng,
                    meal.cook.kitchen_location_lat, meal.cook.kitchen_location_lng
                )
                distance = round(distance, 2)
    
    context = {
        'meal': meal,
        'distance': distance,
    }
    
    return render(request, 'meals/detail.html', context)


@login_required
def my_meals(request):
    """List meals created by the logged-in cook."""
    
    if not request.user.is_cook:
        messages.error(request, 'Only cooks can access this page.')
        return redirect('home')
    
    meals = Meal.objects.filter(cook=request.user.cook_profile).order_by('-created_at')
    
    return render(request, 'meals/my_meals.html', {'meals': meals})


@login_required
def create_meal(request):
    """Create a new meal listing."""
    
    if not request.user.is_cook:
        messages.error(request, 'Only cooks can create meals.')
        return redirect('home')
    
    if request.method == 'POST':
        form = MealForm(request.POST, request.FILES)
        if form.is_valid():
            meal = form.save(commit=False)
            meal.cook = request.user.cook_profile
            meal.is_approved = False  # Needs admin approval
            meal.save()
            messages.success(request, 'Meal created! It will be visible after admin approval.')
            return redirect('meals:my_meals')
    else:
        form = MealForm()
    
    return render(request, 'meals/create.html', {'form': form})


@login_required
def edit_meal(request, pk):
    """Edit an existing meal listing."""
    
    if not request.user.is_cook:
        messages.error(request, 'Only cooks can edit meals.')
        return redirect('home')
    
    meal = get_object_or_404(Meal, pk=pk, cook=request.user.cook_profile)
    
    if request.method == 'POST':
        form = MealForm(request.POST, request.FILES, instance=meal)
        if form.is_valid():
            form.save()
            messages.success(request, 'Meal updated successfully!')
            return redirect('meals:my_meals')
    else:
        form = MealForm(instance=meal)
    
    return render(request, 'meals/edit.html', {'form': form, 'meal': meal})


@login_required
def delete_meal(request, pk):
    """Delete a meal listing."""
    
    if not request.user.is_cook:
        messages.error(request, 'Only cooks can delete meals.')
        return redirect('home')
    
    meal = get_object_or_404(Meal, pk=pk, cook=request.user.cook_profile)
    
    if request.method == 'POST':
        meal.delete()
        messages.success(request, 'Meal deleted successfully!')
        return redirect('meals:my_meals')
    
    return render(request, 'meals/delete_confirm.html', {'meal': meal})

