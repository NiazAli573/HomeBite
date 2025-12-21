from django.core.management.base import BaseCommand
from accounts.models import User, CookProfile, CustomerProfile


class Command(BaseCommand):
    help = 'Setup production users - 5 customers, 4 cooks, 1 admin'

    def handle(self, *args, **options):
        self.stdout.write('\n' + '='*60)
        self.stdout.write('SETTING UP PRODUCTION USERS')
        self.stdout.write('='*60 + '\n')

        # Delete all existing users except superusers
        deleted_count = User.objects.filter(is_superuser=False).count()
        User.objects.filter(is_superuser=False).delete()
        self.stdout.write(f'Deleted {deleted_count} existing non-superusers\n')

        # Customer data
        customers = [
            {'username': 'alihassan', 'email': 'alihassan99@gmail.com', 'first_name': 'Ali', 'last_name': 'Hassan'},
            {'username': 'usmantariq', 'email': 'usman.tariq@gmail.com', 'first_name': 'Usman', 'last_name': 'Tariq'},
            {'username': 'shaheer99', 'email': 'shaheer.khan99@gmail.com', 'first_name': 'Muhammad', 'last_name': 'Shaheer'},
            {'username': 'zaeemnawaz', 'email': 'zaeem.nawaz@gmail.com', 'first_name': 'Zaeem', 'last_name': 'Nawaz'},
            {'username': 'bilalsheikh', 'email': 'bilal.sheikh@gmail.com', 'first_name': 'Bilal', 'last_name': 'Sheikh'},
        ]

        # Cook data
        cooks = [
            {'username': 'azizchef', 'email': 'aziz.chef@gmail.com', 'first_name': 'Abdul', 'last_name': 'Aziz'},
            {'username': 'abidkhan', 'email': 'abid.khan23@gmail.com', 'first_name': 'Abid', 'last_name': 'Khan'},
            {'username': 'salmanchef', 'email': 'salman.chef@gmail.com', 'first_name': 'Salman', 'last_name': 'Ahmed'},
            {'username': 'najeebali', 'email': 'najeeb.ali@gmail.com', 'first_name': 'Najeeb', 'last_name': 'Ali'},
        ]

        # Admin data
        admin_data = {'username': 'homebiteadmin', 'email': 'admin@homebite.com', 'first_name': 'Admin', 'last_name': 'HomeBite'}

        # Create customers
        self.stdout.write('Creating CUSTOMERS:')
        for data in customers:
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                password='test1234',
                first_name=data['first_name'],
                last_name=data['last_name'],
                role='customer'
            )
            CustomerProfile.objects.create(user=user)
            self.stdout.write(self.style.SUCCESS(f"  ✓ {data['first_name']} {data['last_name']} ({data['email']})"))

        # Create cooks
        self.stdout.write('\nCreating COOKS:')
        for data in cooks:
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                password='test1234',
                first_name=data['first_name'],
                last_name=data['last_name'],
                role='cook',
                is_approved=True
            )
            CookProfile.objects.create(user=user)
            self.stdout.write(self.style.SUCCESS(f"  ✓ {data['first_name']} {data['last_name']} ({data['email']})"))

        # Create admin
        self.stdout.write('\nCreating ADMIN:')
        admin_user = User.objects.create_user(
            username=admin_data['username'],
            email=admin_data['email'],
            password='admin1234',
            first_name=admin_data['first_name'],
            last_name=admin_data['last_name'],
            role='admin',
            is_staff=True
        )
        self.stdout.write(self.style.SUCCESS(f"  ✓ {admin_data['first_name']} {admin_data['last_name']} ({admin_data['email']})"))

        # Summary
        self.stdout.write('\n' + '='*60)
        self.stdout.write('SUMMARY')
        self.stdout.write('='*60)
        self.stdout.write(f'Total Users: {User.objects.count()}')
        self.stdout.write(f'Customers: {User.objects.filter(role="customer").count()}')
        self.stdout.write(f'Cooks: {User.objects.filter(role="cook").count()}')
        self.stdout.write(f'Admin: {User.objects.filter(role="admin").count()}')
        self.stdout.write('\n--- User List ---')
        for i, u in enumerate(User.objects.all()):
            self.stdout.write(f'{i+1}. {u.email} | Name: {u.first_name} {u.last_name} | Role: {u.role}')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Production users setup complete!'))
        self.stdout.write('\nDefault passwords:')
        self.stdout.write('  Customers/Cooks: test1234')
        self.stdout.write('  Admin: admin1234')
