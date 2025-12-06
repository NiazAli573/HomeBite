from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Rating
from .serializers import RatingSerializer, RatingCreateSerializer


class RatingViewSet(viewsets.ModelViewSet):
    """ViewSet for managing ratings."""
    permission_classes = [IsAuthenticated]
    serializer_class = RatingSerializer

    def get_queryset(self):
        """Get ratings based on user role."""
        user = self.request.user
        
        if user.role == 'cook' and hasattr(user, 'cook_profile'):
            # Cooks see ratings they received
            return Rating.objects.filter(cook=user.cook_profile).select_related(
                'customer__user', 'meal', 'order'
            )
        elif user.role == 'customer' and hasattr(user, 'customer_profile'):
            # Customers see ratings they gave
            return Rating.objects.filter(customer=user.customer_profile).select_related(
                'cook__user', 'meal', 'order'
            )
        
        return Rating.objects.none()

    def get_serializer_class(self):
        """Use simplified serializer for creation."""
        if self.action == 'create':
            return RatingCreateSerializer
        return RatingSerializer

    def create(self, request, *args, **kwargs):
        """Create a new rating."""
        if request.user.role != 'customer' or not hasattr(request.user, 'customer_profile'):
            return Response(
                {'error': 'Only customers can submit ratings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        rating = serializer.save()
        
        # Return full rating data
        output_serializer = RatingSerializer(rating)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def my_ratings(self, request):
        """Get ratings given by current customer."""
        if request.user.role != 'customer' or not hasattr(request.user, 'customer_profile'):
            return Response(
                {'error': 'Only customers can view their ratings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        ratings = self.get_queryset().order_by('-created_at')
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def received(self, request):
        """Get ratings received by current cook."""
        if request.user.role != 'cook' or not hasattr(request.user, 'cook_profile'):
            return Response(
                {'error': 'Only cooks can view received ratings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        ratings = self.get_queryset().order_by('-created_at')
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data)
