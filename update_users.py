import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'homebite.settings')
import django
django.setup()
from accounts.models import User

print("--- Updating emails to Gmail ---\n")

# Update all non-gmail emails to gmail
email_updates = [
    {'old_email': 'alihassan@outlook.com', 'new_email': 'alihassan99@gmail.com'},
    {'old_email': 'usman.tariq@hotmail.com', 'new_email': 'usman.tariq@gmail.com'},
    {'old_email': 'zaeem.nawaz@outlook.com', 'new_email': 'zaeem.nawaz@gmail.com'},
    {'old_email': 'bilal.sheikh@hotmail.com', 'new_email': 'bilal.sheikh@gmail.com'},
    {'old_email': 'salman.chef@outlook.com', 'new_email': 'salman.chef@gmail.com'},
    {'old_email': 'najeeb.ali@hotmail.com', 'new_email': 'najeeb.ali@gmail.com'},
]

for data in email_updates:
    user = User.objects.filter(email=data['old_email']).first()
    if user:
        user.email = data['new_email']
        user.save()
        print(f"Updated: {user.first_name} {user.last_name} -> {data['new_email']}")

print('\n--- Update Complete! ---\n')

# Display all users
print('=' * 70)
print('UPDATED USER LIST')
print('=' * 70)
users = User.objects.all()
print(f'Total Users: {users.count()}\n')

cooks = users.filter(role='cook')
customers = users.filter(role='customer')
admins = users.filter(role='admin')

print(f"Cooks: {cooks.count()} | Customers: {customers.count()} | Admin: {admins.count()}\n")

for i, u in enumerate(users):
    print(f'{i+1}. {u.email:<35} | {u.first_name} {u.last_name:<15} | {u.role}')

