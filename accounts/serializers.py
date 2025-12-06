from rest_framework import serializers
from .models import User, CookProfile, CustomerProfile


class UserSerializer(serializers.ModelSerializer):
    is_cook = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone', 'address', 'role', 'is_cook', 'is_approved'
        ]
        read_only_fields = ['id', 'is_approved']
    
    def get_is_cook(self, obj):
        return obj.role == 'cook'


class CustomerSignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    office_address = serializers.CharField(write_only=True, required=False, allow_blank=True)
    office_location_lat = serializers.DecimalField(max_digits=9, decimal_places=6, write_only=True, required=False, allow_null=True)
    office_location_lng = serializers.DecimalField(max_digits=9, decimal_places=6, write_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name', 'phone',
            'office_address', 'office_location_lat', 'office_location_lng'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match"})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        
        # Extract customer profile fields
        office_address = validated_data.pop('office_address', '')
        office_location_lat = validated_data.pop('office_location_lat', None)
        office_location_lng = validated_data.pop('office_location_lng', None)
        
        user = User.objects.create_user(
            password=password,
            role='customer',
            **validated_data
        )
        # Create customer profile with location
        CustomerProfile.objects.create(
            user=user,
            office_address=office_address,
            office_location_lat=office_location_lat,
            office_location_lng=office_location_lng
        )
        return user


class CookSignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    kitchen_address = serializers.CharField(write_only=True, required=False)
    kitchen_location_lat = serializers.DecimalField(max_digits=9, decimal_places=6, write_only=True, required=False)
    kitchen_location_lng = serializers.DecimalField(max_digits=9, decimal_places=6, write_only=True, required=False)
    bio = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name', 'phone',
            'kitchen_address', 'kitchen_location_lat', 'kitchen_location_lng', 'bio'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match"})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        
        # Extract cook profile fields
        kitchen_address = validated_data.pop('kitchen_address', '')
        kitchen_location_lat = validated_data.pop('kitchen_location_lat', None)
        kitchen_location_lng = validated_data.pop('kitchen_location_lng', None)
        bio = validated_data.pop('bio', '')
        
        # Create user
        user = User.objects.create_user(
            password=password,
            role='cook',
            **validated_data
        )
        
        # Create cook profile
        CookProfile.objects.create(
            user=user,
            kitchen_address=kitchen_address,
            kitchen_location_lat=kitchen_location_lat,
            kitchen_location_lng=kitchen_location_lng,
            bio=bio
        )
        
        return user
