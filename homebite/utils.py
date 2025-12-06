"""Utility functions for HomeBite application."""
from math import radians, cos, sin, asin, sqrt
from decimal import Decimal


def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees).
    
    Returns distance in kilometers.
    """
    # Convert to float if Decimal
    if isinstance(lon1, Decimal):
        lon1 = float(lon1)
    if isinstance(lat1, Decimal):
        lat1 = float(lat1)
    if isinstance(lon2, Decimal):
        lon2 = float(lon2)
    if isinstance(lat2, Decimal):
        lat2 = float(lat2)
    
    # Convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    
    # Haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    
    # Radius of earth in kilometers
    km = 6371 * c
    return round(km, 2)


def get_nearby_meals(customer_profile, max_distance_km=2):
    """
    Get meals within specified distance from customer's office location.
    
    Args:
        customer_profile: CustomerProfile instance
        max_distance_km: Maximum distance in kilometers (default 2km)
    
    Returns:
        QuerySet of Meal objects with distance annotation
    """
    from meals.models import Meal
    
    if not customer_profile.office_location_lat or not customer_profile.office_location_lng:
        # If customer hasn't set location, return all meals
        return Meal.objects.filter(
            is_active=True,
            is_approved=True,
            quantity_available__gt=0,
            cook__user__is_approved=True,
            cook__user__is_active=True
        )
    
    customer_lat = customer_profile.office_location_lat
    customer_lng = customer_profile.office_location_lng
    
    nearby_meals = []
    meals = Meal.objects.filter(
        is_active=True,
        is_approved=True,
        quantity_available__gt=0,
        cook__user__is_approved=True,
        cook__user__is_active=True,
        cook__kitchen_location_lat__isnull=False,
        cook__kitchen_location_lng__isnull=False
    )
    
    for meal in meals:
        distance = haversine(
            customer_lng,
            customer_lat,
            meal.cook.kitchen_location_lng,
            meal.cook.kitchen_location_lat
        )
        
        if distance <= max_distance_km:
            # Add distance as attribute for frontend display
            meal.distance_km = distance
            nearby_meals.append(meal)
    
    # Sort by distance
    nearby_meals.sort(key=lambda m: m.distance_km)
    
    return nearby_meals
