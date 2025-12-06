from django import forms
from .models import Meal


class MealForm(forms.ModelForm):
    """Form for creating and editing meals."""
    
    class Meta:
        model = Meal
        fields = ['name', 'description', 'photo', 'price', 'quantity_available', 'ready_time', 'is_active']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Dish name'}),
            'description': forms.Textarea(attrs={
                'class': 'form-control', 
                'rows': 3, 
                'placeholder': 'Describe your dish...'
            }),
            'photo': forms.FileInput(attrs={'class': 'form-control'}),
            'price': forms.NumberInput(attrs={
                'class': 'form-control', 
                'placeholder': 'Price in PKR',
                'min': '0',
                'step': '1'
            }),
            'quantity_available': forms.NumberInput(attrs={
                'class': 'form-control', 
                'min': '0',
                'placeholder': 'Available quantity'
            }),
            'ready_time': forms.TimeInput(attrs={
                'class': 'form-control', 
                'type': 'time'
            }),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
    
    def clean_price(self):
        price = self.cleaned_data.get('price')
        if price and price < 0:
            raise forms.ValidationError('Price cannot be negative.')
        return price
    
    def clean_quantity_available(self):
        quantity = self.cleaned_data.get('quantity_available')
        if quantity and quantity < 0:
            raise forms.ValidationError('Quantity cannot be negative.')
        return quantity


class MealFilterForm(forms.Form):
    """Form for filtering meals in browse view."""
    
    SORT_CHOICES = [
        ('distance', 'Distance (Nearest)'),
        ('price_low', 'Price (Low to High)'),
        ('price_high', 'Price (High to Low)'),
        ('rating', 'Rating (Highest)'),
    ]
    
    max_distance = forms.DecimalField(
        required=False,
        min_value=0.5,
        max_value=5.0,
        initial=2.0,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'step': '0.5',
            'placeholder': 'Max distance (km)'
        })
    )
    
    max_price = forms.DecimalField(
        required=False,
        min_value=0,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'Max price (PKR)'
        })
    )
    
    sort_by = forms.ChoiceField(
        choices=SORT_CHOICES,
        required=False,
        initial='distance',
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    
    search = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Search meals...'
        })
    )
