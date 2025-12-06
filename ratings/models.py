from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from accounts.models import CustomerProfile, CookProfile
from meals.models import Meal
from orders.models import Order


class Rating(models.Model):
    """Model for customer ratings of meals and cooks."""
    
    # Who is rating
    customer = models.ForeignKey(
        CustomerProfile, 
        on_delete=models.CASCADE, 
        related_name='ratings_given'
    )
    
    # What is being rated
    order = models.OneToOneField(
        Order, 
        on_delete=models.CASCADE, 
        related_name='rating_detail',
        help_text='The order being rated'
    )
    meal = models.ForeignKey(
        Meal, 
        on_delete=models.CASCADE, 
        related_name='ratings'
    )
    cook = models.ForeignKey(
        CookProfile, 
        on_delete=models.CASCADE, 
        related_name='ratings_received'
    )
    
    # Rating details
    meal_rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text='Rating for the meal (1-5)'
    )
    cook_rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text='Rating for the cook (1-5)'
    )
    comment = models.TextField(blank=True, help_text='Optional review comment')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['customer', 'order']  # One rating per order per customer
    
    def __str__(self):
        return f"Rating by {self.customer.user.username} for Order #{self.order.pk}"
    
    def save(self, *args, **kwargs):
        """Update cook's average rating when a new rating is saved."""
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new:
            # Update cook's average rating
            self.cook.update_rating(self.cook_rating)
            
            # Update order rating field for backward compatibility
            self.order.rating = self.meal_rating
            self.order.review = self.comment
            self.order.save(update_fields=['rating', 'review'])
