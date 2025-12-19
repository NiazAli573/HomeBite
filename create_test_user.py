#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'homebite.settings')
django.setup()

from accounts.models import User

# Create a test cook user
user, created = User.objects.get_or_create(
    username='testcook',
    email='testcook@example.com',
    defaults={
        'role': 'cook',
        'phone': '03001234567',
        'address': 'Test Address',
        'is_active': True
    }
)
user.set_password('Test@1234')
user.save()

if created:
    print(f"✅ Created cook user: {user.username} ({user.email})")
else:
    print(f"✓ User already exists: {user.username}")
    
print(f"Can authenticate: {user.check_password('Test@1234')}")

# Create a test customer user too
customer, created = User.objects.get_or_create(
    username='testcustomer',
    email='testcustomer@example.com',
    defaults={
        'role': 'customer',
        'phone': '03009876543',
        'address': 'Customer Address',
        'is_active': True
    }
)
customer.set_password('Test@1234')
customer.save()

if created:
    print(f"✅ Created customer user: {customer.username} ({customer.email})")
else:
    print(f"✓ Customer already exists: {customer.username}")

print("\nTest credentials:")
print("Cook: testcook / Test@1234")
print("Customer: testcustomer / Test@1234")
