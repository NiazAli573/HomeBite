from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User, CookProfile, CustomerProfile


class CustomerSignupForm(UserCreationForm):
    """Form for customer registration."""
    
    email = forms.EmailField(required=True)
    phone = forms.CharField(max_length=20, required=True)
    office_address = forms.CharField(widget=forms.Textarea(attrs={'rows': 2}), required=False)
    office_location_lat = forms.DecimalField(
        max_digits=9, decimal_places=6, required=False,
        widget=forms.HiddenInput()
    )
    office_location_lng = forms.DecimalField(
        max_digits=9, decimal_places=6, required=False,
        widget=forms.HiddenInput()
    )
    
    class Meta:
        model = User
        fields = ['username', 'email', 'phone', 'password1', 'password2']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            if not isinstance(field.widget, forms.HiddenInput):
                field.widget.attrs['class'] = 'form-control'
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = 'customer'
        user.email = self.cleaned_data['email']
        user.phone = self.cleaned_data['phone']
        if commit:
            user.save()
            # Create customer profile
            CustomerProfile.objects.create(
                user=user,
                office_address=self.cleaned_data.get('office_address', ''),
                office_location_lat=self.cleaned_data.get('office_location_lat'),
                office_location_lng=self.cleaned_data.get('office_location_lng')
            )
        return user


class CookSignupForm(UserCreationForm):
    """Form for cook registration."""
    
    email = forms.EmailField(required=True)
    phone = forms.CharField(max_length=20, required=True)
    address = forms.CharField(widget=forms.Textarea(attrs={'rows': 2}), required=True)
    cnic = forms.CharField(max_length=15, required=False, help_text='CNIC number (optional)')
    kitchen_address = forms.CharField(widget=forms.Textarea(attrs={'rows': 2}), required=True)
    kitchen_location_lat = forms.DecimalField(
        max_digits=9, decimal_places=6, required=True,
        widget=forms.HiddenInput()
    )
    kitchen_location_lng = forms.DecimalField(
        max_digits=9, decimal_places=6, required=True,
        widget=forms.HiddenInput()
    )
    bio = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}),
        required=False,
        help_text='Tell customers about yourself and your cooking'
    )
    
    class Meta:
        model = User
        fields = ['username', 'email', 'phone', 'address', 'cnic', 'password1', 'password2']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            if not isinstance(field.widget, forms.HiddenInput):
                field.widget.attrs['class'] = 'form-control'
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = 'cook'
        user.email = self.cleaned_data['email']
        user.phone = self.cleaned_data['phone']
        user.address = self.cleaned_data['address']
        user.cnic = self.cleaned_data.get('cnic', '')
        user.is_approved = True  # Auto-approve cooks - no admin approval needed
        if commit:
            user.save()
            # Create cook profile
            CookProfile.objects.create(
                user=user,
                kitchen_address=self.cleaned_data['kitchen_address'],
                kitchen_location_lat=self.cleaned_data['kitchen_location_lat'],
                kitchen_location_lng=self.cleaned_data['kitchen_location_lng'],
                bio=self.cleaned_data.get('bio', '')
            )
        return user


class LoginForm(AuthenticationForm):
    """Custom login form with Bootstrap styling."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs['class'] = 'form-control'
        self.fields['password'].widget.attrs['class'] = 'form-control'


class CustomerProfileForm(forms.ModelForm):
    """Form for updating customer profile."""
    
    class Meta:
        model = CustomerProfile
        fields = ['office_address', 'office_location_lat', 'office_location_lng']
        widgets = {
            'office_address': forms.Textarea(attrs={'rows': 2, 'class': 'form-control'}),
            'office_location_lat': forms.HiddenInput(),
            'office_location_lng': forms.HiddenInput(),
        }


class CookProfileForm(forms.ModelForm):
    """Form for updating cook profile."""
    
    class Meta:
        model = CookProfile
        fields = ['kitchen_address', 'kitchen_location_lat', 'kitchen_location_lng', 'bio']
        widgets = {
            'kitchen_address': forms.Textarea(attrs={'rows': 2, 'class': 'form-control'}),
            'kitchen_location_lat': forms.HiddenInput(),
            'kitchen_location_lng': forms.HiddenInput(),
            'bio': forms.Textarea(attrs={'rows': 3, 'class': 'form-control'}),
        }


class UserProfileForm(forms.ModelForm):
    """Form for updating user details."""
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone', 'address']
        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-control'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'phone': forms.TextInput(attrs={'class': 'form-control'}),
            'address': forms.Textarea(attrs={'rows': 2, 'class': 'form-control'}),
        }
