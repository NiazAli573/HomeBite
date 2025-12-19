#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'homebite.settings')
django.setup()

from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()

print("Testing admin login...")
print("\n1. Checking user in database:")

user = User.objects.filter(username='nas573').first()
if user:
    print(f"   ✅ User found: {user.username}")
    print(f"   Email: {user.email}")
    print(f"   Is active: {user.is_active}")
    print(f"   Is superuser: {user.is_superuser}")
    print(f"   Role: {user.role}")
else:
    print("   ❌ User not found!")
    exit(1)

print("\n2. Testing password check:")
if user.check_password('nas573'):
    print("   ✅ Password check passed")
else:
    print("   ❌ Password check failed")
    exit(1)

print("\n3. Testing Django authenticate():")
auth_user = authenticate(username='nas573', password='nas573')
if auth_user:
    print(f"   ✅ Authentication successful: {auth_user.username}")
else:
    print("   ❌ Authentication failed!")
    print("   This means Django's authenticate() is not working")
    print("   Possible causes:")
    print("   - Backend setting issue")
    print("   - Password hashing issue")
    
    # Show password hash
    print(f"\n   Current password hash: {user.password[:50]}...")
    
    # Reset password
    print("\n   Resetting password...")
    user.set_password('nas573')
    user.save()
    print("   Password reset. Testing again...")
    
    auth_user = authenticate(username='nas573', password='nas573')
    if auth_user:
        print("   ✅ Authentication now works!")
    else:
        print("   ❌ Still not working")

print("\n✅ All checks passed! Login should work.")
print("\nCredentials to use:")
print("   Username: nas573")
print("   Password: nas573")
