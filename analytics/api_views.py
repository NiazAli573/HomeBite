from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg, Q, F
from django.db.models.functions import Sqrt, Power
from django.utils import timezone
from datetime import timedelta
from accounts.models import User, CookProfile
from meals.models import Meal
from orders.models import Order
from ratings.models import Rating


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_analytics(request):
    """
    Comprehensive admin analytics dashboard
    Returns statistics about users, meals, orders, and ratings
    """
    
    # User Statistics
    total_users = User.objects.count()
    total_cooks = User.objects.filter(role='cook').count()
    total_customers = User.objects.filter(role='customer').count()
    approved_cooks = User.objects.filter(role='cook', is_approved=True).count()
    pending_cooks = User.objects.filter(role='cook', is_approved=False).count()
    
    # Recent signups (last 7 days, 30 days)
    today = timezone.now()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    signups_last_7_days = User.objects.filter(date_joined__gte=week_ago).count()
    signups_last_30_days = User.objects.filter(date_joined__gte=month_ago).count()
    
    # Meal Statistics
    total_meals = Meal.objects.count()
    active_meals = Meal.objects.filter(is_active=True).count()
    inactive_meals = Meal.objects.filter(is_active=False).count()
    meals_with_dinein = Meal.objects.filter(dine_with_us_available=True).count()
    
    # Meals created recently
    meals_last_7_days = Meal.objects.filter(created_at__gte=week_ago).count()
    meals_last_30_days = Meal.objects.filter(created_at__gte=month_ago).count()
    
    # Order Statistics
    total_orders = Order.objects.count()
    pending_orders = Order.objects.filter(status='pending').count()
    confirmed_orders = Order.objects.filter(status='confirmed').count()
    ready_orders = Order.objects.filter(status='ready').count()
    completed_orders = Order.objects.filter(status='completed').count()
    cancelled_orders = Order.objects.filter(status='cancelled').count()
    
    # Orders by type
    pickup_orders = Order.objects.filter(delivery_type='pickup').count()
    delivery_orders = Order.objects.filter(delivery_type='delivery').count()
    dinein_orders = Order.objects.filter(delivery_type='dine_in').count()
    
    # Recent orders
    orders_last_7_days = Order.objects.filter(created_at__gte=week_ago).count()
    orders_last_30_days = Order.objects.filter(created_at__gte=month_ago).count()
    orders_today = Order.objects.filter(created_at__date=today.date()).count()
    
    # Revenue Statistics (completed orders only)
    total_revenue = Order.objects.filter(status='completed').aggregate(
        total=Sum('total_price')
    )['total'] or 0
    
    revenue_last_7_days = Order.objects.filter(
        status='completed',
        created_at__gte=week_ago
    ).aggregate(total=Sum('total_price'))['total'] or 0
    
    revenue_last_30_days = Order.objects.filter(
        status='completed',
        created_at__gte=month_ago
    ).aggregate(total=Sum('total_price'))['total'] or 0
    
    # Rating Statistics
    total_ratings = Rating.objects.count()
    avg_meal_rating = Rating.objects.aggregate(avg=Avg('meal_rating'))['avg'] or 0
    avg_cook_rating = Rating.objects.aggregate(avg=Avg('cook_rating'))['avg'] or 0
    
    # Ratings distribution
    ratings_5_star = Rating.objects.filter(
        Q(meal_rating=5) | Q(cook_rating=5)
    ).count()
    ratings_4_star = Rating.objects.filter(
        Q(meal_rating=4) | Q(cook_rating=4)
    ).count()
    ratings_3_star = Rating.objects.filter(
        Q(meal_rating=3) | Q(cook_rating=3)
    ).count()
    ratings_2_star = Rating.objects.filter(
        Q(meal_rating=2) | Q(cook_rating=2)
    ).count()
    ratings_1_star = Rating.objects.filter(
        Q(meal_rating=1) | Q(cook_rating=1)
    ).count()
    
    # Top performers
    top_cooks = User.objects.filter(role='cook').order_by('-cook_profile__rating')[:5]
    top_cooks_data = []
    for cook in top_cooks:
        try:
            cook_profile = cook.cook_profile
            top_cooks_data.append({
                'id': cook.id,
                'username': cook.username,
                'email': cook.email,
                'rating': float(cook_profile.rating) if cook_profile else 0,
                'total_reviews': cook_profile.total_ratings if cook_profile else 0,
            })
        except:
            top_cooks_data.append({
                'id': cook.id,
                'username': cook.username,
                'email': cook.email,
                'rating': 0,
                'total_reviews': 0,
            })
    
    # Most popular meals
    popular_meals = Meal.objects.annotate(
        order_count=Count('orders')
    ).order_by('-order_count')[:5]
    
    popular_meals_data = [
        {
            'id': meal.id,
            'title': meal.name,
            'cook': meal.cook.user.username,
            'price': float(meal.price),
            'orders': meal.order_count,
            'is_active': meal.is_active,
        }
        for meal in popular_meals
    ]
    
    # Most active customers
    active_customers = User.objects.filter(role='customer').annotate(
        order_count=Count('customer_profile__orders')
    ).order_by('-order_count')[:5]
    
    active_customers_data = [
        {
            'id': customer.id,
            'username': customer.username,
            'email': customer.email,
            'total_orders': customer.order_count,
        }
        for customer in active_customers
    ]
    
    # ============================================================
    # KEY METRICS - Measurable Performance Indicators
    # ============================================================
    
    # METRIC 1: Number of Orders (with trends)
    two_weeks_ago = today - timedelta(days=14)
    orders_previous_week = Order.objects.filter(
        created_at__gte=two_weeks_ago,
        created_at__lt=week_ago
    ).count()
    
    # Calculate week-over-week growth
    if orders_previous_week > 0:
        orders_growth_rate = ((orders_last_7_days - orders_previous_week) / orders_previous_week) * 100
    else:
        orders_growth_rate = 100 if orders_last_7_days > 0 else 0
    
    # Successful orders (completed, not cancelled)
    successful_orders = Order.objects.filter(status='completed').count()
    order_success_rate = (successful_orders / total_orders * 100) if total_orders > 0 else 0
    
    # METRIC 2: Cook Retention Rate (Weekly Active Cooks)
    # A cook is "active" if they received at least one order in the past 7 days
    weekly_active_cooks = CookProfile.objects.filter(
        received_orders__created_at__gte=week_ago
    ).distinct().count()
    
    # Previous week active cooks for comparison
    previous_week_active_cooks = CookProfile.objects.filter(
        received_orders__created_at__gte=two_weeks_ago,
        received_orders__created_at__lt=week_ago
    ).distinct().count()
    
    # Cook retention rate: % of cooks from previous week still active this week
    if previous_week_active_cooks > 0:
        # Get cooks active in both periods
        cooks_active_previous = set(CookProfile.objects.filter(
            received_orders__created_at__gte=two_weeks_ago,
            received_orders__created_at__lt=week_ago
        ).values_list('id', flat=True).distinct())
        
        cooks_active_current = set(CookProfile.objects.filter(
            received_orders__created_at__gte=week_ago
        ).values_list('id', flat=True).distinct())
        
        retained_cooks = len(cooks_active_previous.intersection(cooks_active_current))
        cook_retention_rate = (retained_cooks / len(cooks_active_previous)) * 100
    else:
        cook_retention_rate = 0
    
    # Monthly active cooks
    monthly_active_cooks = CookProfile.objects.filter(
        received_orders__created_at__gte=month_ago
    ).distinct().count()
    
    # Cook activation rate (% of approved cooks who have received orders)
    cooks_with_orders = CookProfile.objects.filter(
        received_orders__isnull=False
    ).distinct().count()
    cook_activation_rate = (cooks_with_orders / approved_cooks * 100) if approved_cooks > 0 else 0
    
    # METRIC 3: Proximity Match Success Rate
    # Orders where customer location is within reasonable distance from cook
    # We calculate this based on orders that were completed successfully
    # vs orders that were cancelled (potentially due to distance issues)
    
    # For proximity analysis, we look at delivery orders specifically
    delivery_total = Order.objects.filter(delivery_type='delivery').count()
    delivery_completed = Order.objects.filter(delivery_type='delivery', status='completed').count()
    delivery_cancelled = Order.objects.filter(delivery_type='delivery', status='cancelled').count()
    
    # Proximity success rate for delivery orders
    if delivery_total > 0:
        proximity_success_rate = (delivery_completed / delivery_total) * 100
    else:
        proximity_success_rate = 0
    
    # Pickup success rate (customers who successfully picked up)
    pickup_total = Order.objects.filter(delivery_type='pickup').count()
    pickup_completed = Order.objects.filter(delivery_type='pickup', status='completed').count()
    pickup_success_rate = (pickup_completed / pickup_total * 100) if pickup_total > 0 else 0
    
    # Dine-in success rate
    dinein_total = Order.objects.filter(delivery_type='dine_in').count()
    dinein_completed = Order.objects.filter(delivery_type='dine_in', status='completed').count()
    dinein_success_rate = (dinein_completed / dinein_total * 100) if dinein_total > 0 else 0
    
    # Overall match success (all order types)
    overall_match_success = (successful_orders / total_orders * 100) if total_orders > 0 else 0
    
    # Average orders per active cook (efficiency metric)
    avg_orders_per_cook = (orders_last_7_days / weekly_active_cooks) if weekly_active_cooks > 0 else 0

    return Response({
        'users': {
            'total': total_users,
            'cooks': total_cooks,
            'customers': total_customers,
            'approved_cooks': approved_cooks,
            'pending_cooks': pending_cooks,
            'signups_last_7_days': signups_last_7_days,
            'signups_last_30_days': signups_last_30_days,
        },
        'meals': {
            'total': total_meals,
            'active': active_meals,
            'inactive': inactive_meals,
            'with_dinein': meals_with_dinein,
            'created_last_7_days': meals_last_7_days,
            'created_last_30_days': meals_last_30_days,
        },
        'orders': {
            'total': total_orders,
            'pending': pending_orders,
            'confirmed': confirmed_orders,
            'ready': ready_orders,
            'completed': completed_orders,
            'cancelled': cancelled_orders,
            'pickup': pickup_orders,
            'delivery': delivery_orders,
            'dinein': dinein_orders,
            'today': orders_today,
            'last_7_days': orders_last_7_days,
            'last_30_days': orders_last_30_days,
        },
        'revenue': {
            'total': float(total_revenue),
            'last_7_days': float(revenue_last_7_days),
            'last_30_days': float(revenue_last_30_days),
        },
        'ratings': {
            'total': total_ratings,
            'avg_meal_rating': round(float(avg_meal_rating), 2),
            'avg_cook_rating': round(float(avg_cook_rating), 2),
            'distribution': {
                '5_star': ratings_5_star,
                '4_star': ratings_4_star,
                '3_star': ratings_3_star,
                '2_star': ratings_2_star,
                '1_star': ratings_1_star,
            }
        },
        'top_performers': {
            'cooks': top_cooks_data,
            'meals': popular_meals_data,
            'customers': active_customers_data,
        },
        'key_metrics': {
            'orders': {
                'total': total_orders,
                'this_week': orders_last_7_days,
                'previous_week': orders_previous_week,
                'growth_rate': round(orders_growth_rate, 1),
                'success_rate': round(order_success_rate, 1),
                'successful': successful_orders,
                'today': orders_today,
            },
            'cook_retention': {
                'weekly_active_cooks': weekly_active_cooks,
                'monthly_active_cooks': monthly_active_cooks,
                'total_approved_cooks': approved_cooks,
                'retention_rate': round(cook_retention_rate, 1),
                'activation_rate': round(cook_activation_rate, 1),
                'avg_orders_per_cook': round(avg_orders_per_cook, 1),
            },
            'proximity_match': {
                'overall_success_rate': round(overall_match_success, 1),
                'delivery': {
                    'total': delivery_total,
                    'completed': delivery_completed,
                    'cancelled': delivery_cancelled,
                    'success_rate': round(proximity_success_rate, 1),
                },
                'pickup': {
                    'total': pickup_total,
                    'completed': pickup_completed,
                    'success_rate': round(pickup_success_rate, 1),
                },
                'dinein': {
                    'total': dinein_total,
                    'completed': dinein_completed,
                    'success_rate': round(dinein_success_rate, 1),
                },
            },
        }
    })
