from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Create admin user nas573 if it does not exist'

    def handle(self, *args, **options):
        username = 'nas573'
        
        # Check if admin user already exists
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f'Admin user "{username}" already exists')
            )
            return

        # Create admin user
        admin = User.objects.create_user(
            username=username,
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

        self.stdout.write(
            self.style.SUCCESS(f'✅ Admin user "{username}" created successfully')
        )
        self.stdout.write(f'Username: {username}')
        self.stdout.write(f'Password: nas573')
