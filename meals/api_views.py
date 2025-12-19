from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import Meal
from .serializers import MealSerializer, MealListSerializer
from homebite.utils import get_nearby_meals


class MealViewSet(viewsets.ModelViewSet):
    queryset = Meal.objects.filter(is_active=True, is_approved=True).select_related('cook', 'cook__user')
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return MealListSerializer
        return MealSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # If user is a cook viewing their own meals, show all (including unapproved)
        if self.action == 'my_meals' and self.request.user.is_authenticated:
            if hasattr(self.request.user, 'cook_profile'):
                return Meal.objects.filter(cook=self.request.user.cook_profile)
        return queryset

    def perform_create(self, serializer):
        if self.request.user.role != 'cook' or not hasattr(self.request.user, 'cook_profile'):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only cooks can create meals')
        if not self.request.user.is_approved:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Cook account pending admin approval')
        # Auto-approve and activate meals (no admin approval needed for MVP)
        serializer.save(cook=self.request.user.cook_profile, is_approved=True, is_active=True)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='my-meals')
    def my_meals(self, request):
        """Get meals created by current cook with quantity available"""
        if request.user.role != 'cook' or not hasattr(request.user, 'cook_profile'):
            return Response({'error': 'Not a cook'}, status=status.HTTP_403_FORBIDDEN)
        
        # Get cook's meals that still have quantity available
        meals = Meal.objects.filter(
            cook=request.user.cook_profile,
            quantity_available__gt=0
        ).order_by('-created_at')
        serializer = self.get_serializer(meals, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def nearby(self, request):
        """Get nearby meals based on customer's office location."""
        if request.user.role != 'customer' or not hasattr(request.user, 'customer_profile'):
            return Response({'error': 'Only customers can view nearby meals'}, status=status.HTTP_403_FORBIDDEN)
        
        # Get max distance from query params (default 2km)
        max_distance = float(request.query_params.get('max_distance', 2))
        
        # Get nearby meals using haversine formula
        nearby_meals = get_nearby_meals(request.user.customer_profile, max_distance)
        
        serializer = MealListSerializer(nearby_meals, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def browse(self, request):
        """Browse all available meals (no location filter)."""
        meals = self.get_queryset()
        
        # Apply additional filters from query params
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        dine_in = request.query_params.get('dine_in')
        
        if min_price:
            meals = meals.filter(price__gte=min_price)
        if max_price:
            meals = meals.filter(price__lte=max_price)
        if dine_in == 'true':
            meals = meals.filter(dine_with_us_available=True)
        
        serializer = self.get_serializer(meals, many=True)
        return Response(serializer.data)
