# HomeBite - Complete Deployment Guide

## Project Overview
HomeBite is a full-stack Django + React application that connects home-cooked meal enthusiasts with customers. The platform features location-based meal discovery, real-time order management, and a professional rating system.

### Technology Stack
- **Backend**: Django 5.2.7, Django REST Framework
- **Frontend**: React 18.2.0, Vite 5.4.21
- **Database**: SQLite (development) / PostgreSQL (production)
- **Location Services**: Nominatim API (OpenStreetMap)
- **Maps**: Leaflet.js for interactive map selection

---

## Prerequisites for Deployment

### System Requirements
- Python 3.9+
- Node.js 16+
- Git

### Supported Platforms
- **Vercel** - For frontend (React)
- **Railway/Render** - For backend (Django)
- **Heroku** - Alternative backend option

---

## Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/NiazAli573/HomeBite.git
cd HomeBite
```

### 2. Backend Setup (Django)

#### Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Environment Configuration
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your settings
# SECRET_KEY=your-secret-key
# DEBUG=True
# ALLOWED_HOSTS=localhost,127.0.0.1
```

#### Database Setup
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend will run on: `http://127.0.0.1:8000`

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: `http://localhost:3000`

---

## Deployment Instructions

### Option 1: Deploy Frontend to Vercel

#### Prepare Frontend
```bash
cd frontend
npm run build
```

#### Deploy
1. Go to [vercel.com](https://vercel.com)
2. Connect GitHub repository
3. Select the `frontend` folder as root directory
4. Set environment variables (API URL)
5. Deploy

**Frontend Environment Variables for Vercel:**
```
VITE_API_URL=https://your-backend-domain.com/api
```

### Option 2: Deploy Backend to Railway

#### Prerequisites
- Railway account at [railway.app](https://railway.app)

#### Steps
1. Connect GitHub repository to Railway
2. Select this project
3. Add PostgreSQL plugin
4. Set environment variables:

```
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=your-domain.railway.app
DATABASE_URL=postgresql://...
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

5. Configure build command: `pip install -r requirements.txt && python manage.py migrate`
6. Configure start command: `gunicorn homebite.wsgi:application --bind 0.0.0.0:$PORT`

#### Update Django Settings for Production
Edit `homebite/settings.py`:
```python
DATABASES = {
    'default': dj_database_url.config(default=os.getenv('DATABASE_URL'))
}

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
```

### Option 3: Alternative - Heroku Deployment

#### Install Heroku CLI and Login
```bash
heroku login
heroku create your-app-name
```

#### Set Environment Variables
```bash
heroku config:set SECRET_KEY=your-secret-key
heroku config:set ALLOWED_HOSTS=your-app-name.herokuapp.com
```

#### Deploy
```bash
git push heroku main
heroku run python manage.py migrate
```

---

## Project Structure

```
HomeBite/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx
│   ├── public/              # Static assets
│   └── package.json
│
├── accounts/                # Django user management
│   ├── models.py           # User and profile models
│   ├── views.py            # Authentication views
│   └── urls.py
│
├── meals/                   # Meal management
│   ├── models.py           # Meal model
│   ├── views.py            # Meal views and APIs
│   └── urls.py
│
├── orders/                  # Order management
│   ├── models.py           # Order model
│   ├── views.py            # Order views and APIs
│   └── urls.py
│
├── dashboard/               # Dashboard functionality
│   ├── models.py
│   ├── views.py            # Cook and customer dashboards
│   └── urls.py
│
├── homebite/               # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── manage.py               # Django management script
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

---

## Key Features

### User Management
- Customer and Cook registration with location-based signup
- JWT authentication
- User profiles with preferences

### Meal Management
- Create, read, update, delete meals
- Location-based meal discovery (haversine formula)
- Image upload support
- Meal filtering and search

### Order Management
- Place orders with delivery location
- Real-time order status tracking
- Order history and cancellation
- Order confirmation workflow

### Dashboard
- Cook dashboard with order management
- Customer dashboard with order history
- Real-time statistics and earnings tracking
- Meal ratings and reviews

### Location Services
- Interactive map-based location selection (Leaflet)
- Address geocoding (Nominatim API)
- Nearby meal filtering
- Location-based cook discovery

---

## Environment Variables

### Backend (.env)
```
DEBUG=False
SECRET_KEY=your-random-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.vercel.app
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8000/api
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register/customer/` - Register as customer
- `POST /api/auth/register/cook/` - Register as cook
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user

### Meals
- `GET /api/meals/` - Get all meals
- `GET /api/meals/{id}/` - Get meal details
- `POST /api/meals/` - Create meal (cook only)
- `PUT /api/meals/{id}/` - Update meal
- `DELETE /api/meals/{id}/` - Delete meal
- `GET /api/meals/nearby/` - Get nearby meals

### Orders
- `GET /api/orders/` - Get user's orders
- `POST /api/orders/` - Create order
- `GET /api/orders/{id}/` - Get order details
- `PUT /api/orders/{id}/` - Update order status
- `DELETE /api/orders/{id}/` - Cancel order

### Dashboard
- `GET /api/dashboard/cook/` - Cook dashboard data
- `GET /api/dashboard/customer/` - Customer dashboard data
- `GET /api/dashboard/stats/` - Dashboard statistics

---

## Testing

### Backend Tests
```bash
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

---

## Troubleshooting

### Database Issues
```bash
# Reset database
python manage.py migrate zero
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### CORS Errors
Ensure `CORS_ALLOWED_ORIGINS` in `homebite/settings.py` matches your frontend domain.

### Static Files Not Loading
```bash
python manage.py collectstatic --noinput
```

### API Connection Issues
Check:
1. Backend server is running on correct port
2. `VITE_API_URL` points to correct backend domain
3. CORS headers are properly configured

---

## Production Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Use strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS/SSL
- [ ] Set up proper logging
- [ ] Configure email backend
- [ ] Run security checks: `python manage.py check --deploy`
- [ ] Optimize images and static files
- [ ] Set up CDN for static assets
- [ ] Configure database backups
- [ ] Set up monitoring and alerts

---

## Support & Documentation

- **Backend API Documentation**: `/api/docs/` (when running locally)
- **Django Docs**: https://docs.djangoproject.com
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

---

## Contributors

- Development Team

---

## License

This project is proprietary and confidential.

---

**Last Updated**: December 6, 2025
