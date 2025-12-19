#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'homebite.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Check if admin user exists
admin = User.objects.filter(username='nas573').first()

if admin:
    print(f'✅ User exists: {admin.username}')
    print(f'Email: {admin.email}')
    print(f'Is superuser: {admin.is_superuser}')
    print(f'Is staff: {admin.is_staff}')
    print(f'Role: {admin.role}')
    print(f'Is approved: {admin.is_approved}')
    print(f'Is active: {admin.is_active}')
    print(f'Password set: {bool(admin.password)}')
    
    # Test password
    print('\nTesting password "nas573":')
    if admin.check_password('nas573'):
        print('✅ Password "nas573" is correct')
    else:
        print('❌ Password "nas573" is incorrect')
        print('\nResetting password to "nas573"...')
        admin.set_password('nas573')
        admin.save()
        print('✅ Password has been reset to "nas573"')
else:
    print('❌ User nas573 does not exist')
    print('\nCreating admin user nas573...')
    
    admin = User.objects.create_user(
        username='nas573',
        email='admin@homebite.com',
        password='nas573',
        role='admin',
        first_name='Admin',
        last_name='User',
        phone='03001234567',
        address='Admin Address'
    )
    admin.is_superuser = True
    admin.is_staff = True
    admin.is_approved = True
    admin.save()
    
    print('✅ Admin user created successfully')
    print(f'Username: nas573')
    print(f'Password: nas573')
