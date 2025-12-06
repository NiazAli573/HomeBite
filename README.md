# HomeBite

🍽️ **Hyperlocal home-cooked meals marketplace** - Connecting home cooks with office workers for fresh, homemade meals.

## 🌟 Features

### For Customers (Office Workers)
- **Browse Meals**: View all available meals with filters
- **Nearby Meals**: Toggle to show only meals within 1-5 km radius using haversine distance calculation
- **Meal Details**: View full meal info with cook ratings, location, and dine-in availability
- **Order Placement**: Choose pickup, delivery, or dine-in options
- **Order Tracking**: Real-time status updates (pending → confirmed → ready → completed)
- **Cancel Orders**: Cancel pending/confirmed orders with automatic quantity restoration
- **Rate & Review**: Rate both meal and cook after completion (1-5 stars + comments)
- **Customer Dashboard**: View active orders, completed orders, total spent, and orders awaiting rating
- **Reorder**: Quick reorder button on completed orders
- **Auto-refresh**: Dashboard polls for updates every 20 seconds

### For Home Cooks
- **Meal Management**: Create, edit, and delete meal listings with photos
- **Dine-With-Us**: Enable dine-in option with separate pricing
- **Inventory Control**: Automatic quantity reduction on orders; auto sold-out when quantity reaches 0
- **Order Management**: Confirm, mark ready, and complete orders with action buttons
- **Cook Dashboard**: 
  - Today's statistics (orders, earnings, ratings)
  - Orders grouped by status (pending, confirmed, ready, completed)
  - Real-time updates via 20-second polling
  - All-time stats (total orders, average rating, total reviews)
- **Reputation System**: Build rating through customer reviews
- **Location-Based**: Set kitchen address for customer visibility

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Bootstrap 5
- **Backend**: Django 4.2+ with Django REST Framework
- **Database**: PostgreSQL (SQLite for development)
- **Maps**: Leaflet.js + OpenStreetMap
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Deployment**: Vercel-compatible configuration

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL (for production)
- pip and npm package managers

## 🚀 Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/Mujeeb-U-Rehman/Homebite.git
cd Homebite
```

### 2. Create virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up environment variables

Create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=  # Leave empty for SQLite
```

### 5. Run database migrations

```bash
python manage.py migrate
```

### 6. Create a superuser (admin)

```bash
python manage.py createsuperuser
```

Default admin credentials for testing:
- Username: `admin`
- Email: `admin@homebite.com`
- Password: `admin123`

### 7. Run the development server

```bash
python manage.py runserver
```

Visit http://127.0.0.1:8000 to see the application.

## 📁 Project Structure

```
Homebite/
├── manage.py
├── requirements.txt
├── vercel.json                 # Vercel deployment config
├── build_files.sh              # Build script for Vercel
├── homebite/                   # Main project
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── accounts/                   # User management app
│   ├── models.py              # User, CookProfile, CustomerProfile
│   ├── views.py               # Signup, login, profile views
│   ├── forms.py
│   ├── urls.py
│   ├── admin.py
│   └── templates/accounts/
├── meals/                      # Meals app
│   ├── models.py              # Meal model
│   ├── views.py               # CRUD, browse, search
│   ├── forms.py
│   ├── urls.py
│   ├── admin.py
│   └── templates/meals/
├── orders/                     # Orders app
│   ├── models.py              # Order model
│   ├── views.py               # Place order, order history
│   ├── urls.py
│   ├── admin.py
│   └── templates/orders/
├── dashboard/                  # Cook dashboard app
│   ├── views.py
│   ├── urls.py
│   └── templates/dashboard/
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── media/                      # Uploaded images
├── templates/
│   ├── base.html
│   └── home.html
└── README.md
```

## 🗄️ Database Models

### User (extends AbstractUser)
- `role`: cook/customer/admin
- `phone`: contact number
- `address`: user address
- `cnic`: optional ID number
- `is_approved`: admin approval status

### CookProfile
- Kitchen location (lat/lng)
- Kitchen address
- Rating (0-5)
- Total orders/ratings

### CustomerProfile
- Office location (lat/lng)
- Office address

### Meal
- Name, description, photo
- Price (PKR)
- Quantity available
- Ready time
- Approval status

### Order
- Customer, meal, cook references
- Quantity, total price (calculated based on delivery type)
- Status (pending/confirmed/ready/completed/cancelled)
- Delivery type (pickup/delivery/dine_in)
- Payment method (cash)
- Order flow: pending → confirmed → ready → completed
- Cancel with quantity restoration
- Status-specific actions for cook and customer

### Rating
- One rating per order
- Separate ratings for meal (1-5) and cook (1-5)
- Optional comment/review
- Updates cook's average rating automatically
- Only completed orders can be rated

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SECRET_KEY` | Django secret key | Yes |
| `DEBUG` | Debug mode (True/False) | No (default: True) |
| `ALLOWED_HOSTS` | Comma-separated hosts | No |
| `DATABASE_URL` | PostgreSQL connection URL | No (SQLite fallback) |

## 🚀 Vercel Deployment

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Configure environment variables on Vercel

Set the following in your Vercel project settings:
- `SECRET_KEY`: Generate a strong secret key
- `DEBUG`: False
- `ALLOWED_HOSTS`: your-app.vercel.app
- `DATABASE_URL`: Your PostgreSQL connection string (Vercel Postgres, Supabase, or Neon)

### 3. Deploy

```bash
vercel
```

### Database Options for Vercel

1. **Vercel Postgres** (Recommended)
   - Create from Vercel dashboard
   - Connection string auto-injected

2. **Supabase**
   - Free tier available
   - Get connection string from project settings

3. **Neon**
   - Serverless PostgreSQL
   - Perfect for Vercel deployments

### Static & Media Files

- **Static files**: Served via WhiteNoise
- **Media files**: For production, use Cloudinary or AWS S3

## 📱 Pages

1. **Home Page** - Hero section, how it works, featured meals
2. **Cook Signup** - Multi-step form with location picker
3. **Customer Signup** - Simple form with office location
4. **Login** - For both roles
5. **Browse Meals** - Card grid with filters
6. **Meal Detail** - Full details, cook info, order button
7. **Place Order** - Quantity, delivery type, confirm
8. **Order Confirmation** - Success page with details
9. **Customer Order History** - List of past orders
10. **Cook Dashboard** - Today's orders, actions, stats
11. **Cook Meal Management** - Add/edit/delete meals
12. **Profile Pages** - Edit profile for both roles

## 🔧 Admin Panel

Access at `/admin/` with superuser credentials.

**Features:**
- Approve/reject cook accounts
- Approve/reject meal listings
- View all orders with status filters
- User management (enable/disable)
- Bulk actions for efficiency

## 📝 API Endpoints

The application uses Django REST Framework for comprehensive API support:

### Meals API
- `GET /api/meals/` - Browse all meals
- `GET /api/meals/nearby/` - Get nearby meals (customer only, uses haversine)
- `GET /api/meals/{id}/` - Meal detail
- `GET /api/meals/my-meals/` - Cook's meals with available quantity
- `POST /api/meals/` - Create meal (cook only)
- `PUT /api/meals/{id}/` - Update meal (cook only)
- `DELETE /api/meals/{id}/` - Delete meal (cook only)

### Orders API
- `GET /api/orders/` - Get user's orders (filtered by role)
- `GET /api/orders/active/` - Get active orders (pending/confirmed/ready)
- `GET /api/orders/completed/` - Get completed orders
- `GET /api/orders/history/` - Full order history
- `GET /api/orders/{id}/` - Order detail
- `POST /api/orders/` - Create order (customer only, validates inventory)
- `POST /api/orders/{id}/confirm/` - Confirm order (cook only)
- `POST /api/orders/{id}/mark_ready/` - Mark ready (cook only)
- `POST /api/orders/{id}/complete/` - Complete order (cook only)
- `POST /api/orders/{id}/cancel/` - Cancel order (customer only)

### Ratings API
- `GET /api/ratings/` - Get user's ratings
- `GET /api/ratings/my_ratings/` - Customer's given ratings
- `GET /api/ratings/received/` - Cook's received ratings
- `POST /api/ratings/` - Submit rating (customer only, completed orders only)

### Dashboard API
- `GET /api/dashboard/cook/stats/` - Cook statistics (today & all-time)
- `GET /api/dashboard/cook/todays-orders/` - Today's orders grouped by status
- `GET /api/dashboard/customer/stats/` - Customer statistics

### Auth API
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/signup/` - User registration
- `GET /api/auth/user/` - Current user info
- `GET /api/auth/csrf/` - Get CSRF token

## 🔒 Security Features

- CSRF protection on all forms
- Secure password hashing (Django's PBKDF2)
- Role-based access control
- Session-based authentication
- Input validation on all forms

## 🧪 Testing

```bash
python manage.py test
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue on GitHub or contact the maintainers.

---

Made with ❤️ for home cooks and food lovers
