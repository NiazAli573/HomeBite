#!/bin/bash

# Build script for Vercel deployment

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate --noinput

# Create admin user
python manage.py create_admin

# Collect static files
python manage.py collectstatic --noinput

# Apply database migrations
python manage.py migrate --noinput
