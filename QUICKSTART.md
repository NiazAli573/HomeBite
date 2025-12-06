# Quick Start Guide

## First Time Setup

Run the automated setup script:

```powershell
.\setup.ps1
```

This will:
- Create Python virtual environment
- Install Python dependencies
- Run database migrations
- Install Node.js dependencies

## Manual Setup

### Backend
```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start server
python manage.py runserver
```

### Frontend
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

## Development

Open two terminals:

**Terminal 1 - Backend:**
```bash
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

- Backend API: http://localhost:8000/api
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:8000/admin

## Creating Test Users

### Customer Account
```bash
python manage.py createsuperuser
# Then in Django admin or via signup form
```

### Cook Account
Use the signup form at http://localhost:3000/signup/cook

## Common Commands

### Backend
- `python manage.py makemigrations` - Create migrations
- `python manage.py migrate` - Apply migrations
- `python manage.py createsuperuser` - Create admin user
- `python manage.py collectstatic` - Collect static files

### Frontend
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Troubleshooting

### Port Already in Use
- Backend: Change port with `python manage.py runserver 8001`
- Frontend: Change port in `vite.config.js`

### CORS Errors
- Ensure both servers are running
- Check `CORS_ALLOWED_ORIGINS` in `settings.py`

### Module Not Found
- Backend: Activate virtual environment
- Frontend: Run `npm install` in frontend directory
