from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator


class User(AbstractUser):
    """Custom User model supporting cook, customer, and admin roles."""
    
    ROLE_CHOICES = [
        ('cook', 'Home Cook'),
        ('customer', 'Customer'),
        ('admin', 'Admin'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    cnic = models.CharField(max_length=15, blank=True, help_text='CNIC number (optional)')
    is_approved = models.BooleanField(default=True, help_text='Cook accounts require admin approval')
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    @property
    def is_cook(self):
        return self.role == 'cook'
    
    @property
    def is_customer(self):
        return self.role == 'customer'
    
    @property
    def is_admin_user(self):
        return self.role == 'admin' or self.is_superuser


class CookProfile(models.Model):
    """Profile for home cooks with kitchen location and ratings."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cook_profile')
    kitchen_location_lat = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True,
        help_text='Kitchen latitude'
    )
    kitchen_location_lng = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True,
        help_text='Kitchen longitude'
    )
    kitchen_address = models.TextField(blank=True)
    rating = models.DecimalField(
        max_digits=2, decimal_places=1, default=0.0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    total_orders = models.IntegerField(default=0)
    total_ratings = models.IntegerField(default=0)
    bio = models.TextField(blank=True, help_text='Short bio about the cook')
    
    def __str__(self):
        return f"Cook: {self.user.username}"
    
    def update_rating(self, new_rating):
        """Update the cook's average rating."""
        total_score = float(self.rating) * self.total_ratings + new_rating
        self.total_ratings += 1
        self.rating = total_score / self.total_ratings
        self.save()


class CustomerProfile(models.Model):
    """Profile for customers (office workers) with office location."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    office_location_lat = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True,
        help_text='Office latitude'
    )
    office_location_lng = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True,
        help_text='Office longitude'
    )
    office_address = models.TextField(blank=True)
    
    def __str__(self):
        return f"Customer: {self.user.username}"
