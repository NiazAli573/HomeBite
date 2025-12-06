from django.db import models
from django.utils import timezone
from accounts.models import CookProfile


class Meal(models.Model):
    """Model representing a meal listing by a cook."""
    
    cook = models.ForeignKey(CookProfile, on_delete=models.CASCADE, related_name='meals')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    photo = models.ImageField(upload_to='meals/', blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text='Price in PKR')
    quantity_available = models.PositiveIntegerField(default=1)
    ready_time = models.TimeField(help_text='Time when meal will be ready')
    is_approved = models.BooleanField(default=False, help_text='Admin approval status')
    is_active = models.BooleanField(default=True, help_text='Is meal currently available')
    
    # Dine-with-us feature
    dine_with_us_available = models.BooleanField(
        default=False, 
        help_text='Allow customers to dine at your place'
    )
    dine_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text='Price for dine-in (PKR)'
    )
    
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at', '-updated_at']
    
    def __str__(self):
        return f"{self.name} by {self.cook.user.username}"
    
    @property
    def is_available(self):
        """Check if meal is available for ordering."""
        return (
            self.is_active and 
            self.is_approved and 
            self.quantity_available > 0 and
            self.cook.user.is_approved and
            self.cook.user.is_active
        )
    
    @property
    def cook_rating(self):
        """Get the cook's rating."""
        return self.cook.rating
    
    @property
    def average_meal_rating(self):
        """Calculate average rating for this specific meal."""
        ratings = self.ratings.all()
        if not ratings:
            return 0.0
        total = sum(r.meal_rating for r in ratings)
        return round(total / len(ratings), 1)
    
    @property
    def total_meal_ratings(self):
        """Get total number of ratings for this meal."""
        return self.ratings.count()
    
    def reduce_quantity(self, amount=1):
        """Reduce available quantity after an order."""
        if self.quantity_available >= amount:
            self.quantity_available -= amount
            # Auto mark as sold out if quantity reaches 0
            if self.quantity_available == 0:
                self.is_active = False
            self.save()
            return True
        return False
