from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from .serializers import UserSerializer, CustomerSignupSerializer, CookSignupSerializer
from .models import User


@api_view(['GET'])
@permission_classes([AllowAny])
def current_user(request):
    """Get current authenticated user, or return null if not authenticated"""
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    else:
        return Response({'user': None}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login user"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        # Block unapproved cooks
        if user.role == 'cook' and not user.is_approved:
            return Response(
                {'error': 'Cook account pending approval by admin'},
                status=status.HTTP_403_FORBIDDEN
            )
        login(request, user)
        # Ensure CSRF token is set in the response
        get_token(request)
        serializer = UserSerializer(user)
        return Response({
            'message': 'Login successful',
            'user': serializer.data
        })
    else:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout user"""
    logout(request)
    return Response({'message': 'Logout successful'})


@api_view(['POST'])
@permission_classes([AllowAny])
def customer_signup(request):
    """Register new customer"""
    serializer = CustomerSignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        # Ensure CSRF token is set in the response
        get_token(request)
        user_serializer = UserSerializer(user)
        return Response({
            'message': 'Signup successful',
            'user': user_serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def cook_signup(request):
    """Register new cook"""
    serializer = CookSignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Do NOT log in unapproved cooks; require admin approval
        return Response({
            'message': 'Cook signup successful. Awaiting admin approval.',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def pending_cooks(request):
    """List pending cook accounts for admin review."""
    pending = User.objects.filter(role='cook', is_approved=False).order_by('-date_joined')
    return Response(UserSerializer(pending, many=True).data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_cook(request):
    """Approve a cook account."""
    user_id = request.data.get('user_id')
    try:
        user = User.objects.get(id=user_id, role='cook')
    except User.DoesNotExist:
        return Response({'error': 'Cook not found'}, status=status.HTTP_404_NOT_FOUND)
    user.is_approved = True
    user.save(update_fields=['is_approved'])
    return Response({'message': 'Cook approved', 'user': UserSerializer(user).data})


@api_view(['POST'])
@permission_classes([IsAdminUser])
def disapprove_cook(request):
    """Disapprove / disable a cook account."""
    user_id = request.data.get('user_id')
    try:
        user = User.objects.get(id=user_id, role='cook')
    except User.DoesNotExist:
        return Response({'error': 'Cook not found'}, status=status.HTTP_404_NOT_FOUND)
    user.is_approved = False
    user.save(update_fields=['is_approved'])
    return Response({'message': 'Cook disapproved', 'user': UserSerializer(user).data})


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Get or update user profile"""
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
