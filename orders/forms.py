from django import forms
from .models import Order


class PlaceOrderForm(forms.Form):
    """Form for placing an order."""
    
    quantity = forms.IntegerField(
        min_value=1,
        initial=1,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'min': '1',
        })
    )
    
    delivery_type = forms.ChoiceField(
        choices=Order.DELIVERY_TYPE_CHOICES,
        widget=forms.RadioSelect(attrs={'class': 'form-check-input'})
    )
    
    customer_phone = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Your phone number'
        })
    )
    
    notes = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 2,
            'placeholder': 'Any special instructions? (optional)'
        })
    )
    
    def __init__(self, *args, meal=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.meal = meal
        if meal:
            self.fields['quantity'].widget.attrs['max'] = meal.quantity_available
    
    def clean_quantity(self):
        quantity = self.cleaned_data['quantity']
        if self.meal and quantity > self.meal.quantity_available:
            raise forms.ValidationError(
                f'Only {self.meal.quantity_available} available.'
            )
        return quantity


class OrderRatingForm(forms.Form):
    """Form for rating an order."""
    
    rating = forms.IntegerField(
        min_value=1,
        max_value=5,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'min': '1',
            'max': '5'
        })
    )
    
    comment = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 2,
            'placeholder': 'Leave a comment (optional)'
        })
    )
