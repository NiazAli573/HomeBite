#!/bin/bash
# Script to run migrations on Railway
# This ensures database tables are created before the app starts

set -e  # Exit on error

echo "🔄 Running database migrations..."
python manage.py migrate --noinput

echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

echo "✅ Migrations and static files ready!"
echo "🚀 Starting application..."

exec gunicorn homebite.wsgi:application --bind 0.0.0.0:${PORT:-8000}

