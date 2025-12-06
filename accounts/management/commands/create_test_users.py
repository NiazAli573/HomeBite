from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = 'Create test users for development and production testing'

    def handle(self, *args, **options):
        # Create test cook user
        cook, created = User.objects.get_or_create(
            username='testcook',
            defaults={
                'email': 'testcook@example.com',
                'role': 'cook',
                'phone': '03001234567',
                'address': 'Test Kitchen, Karachi',
                'is_active': True,
                'is_approved': True,
            }
        )
        if created:
            cook.set_password('Test@1234')
            cook.save()
            self.stdout.write(self.style.SUCCESS(f'✅ Created cook: {cook.username}'))
        else:
            self.stdout.write(f'✓ Cook already exists: {cook.username}')

        # Create test customer user
        customer, created = User.objects.get_or_create(
            username='testcustomer',
            defaults={
                'email': 'testcustomer@example.com',
                'role': 'customer',
                'phone': '03009876543',
                'address': 'Test Address, Karachi',
                'is_active': True,
            }
        )
        if created:
            customer.set_password('Test@1234')
            customer.save()
            self.stdout.write(self.style.SUCCESS(f'✅ Created customer: {customer.username}'))
        else:
            self.stdout.write(f'✓ Customer already exists: {customer.username}')

        self.stdout.write(self.style.SUCCESS('\n✅ Test users ready!'))
        self.stdout.write('Credentials:')
        self.stdout.write('  Cook: testcook / Test@1234')
        self.stdout.write('  Customer: testcustomer / Test@1234')
