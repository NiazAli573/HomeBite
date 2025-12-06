release: python manage.py migrate --noinput && python manage.py collectstatic --noinput
web: gunicorn homebite.wsgi:application --bind 0.0.0.0:$PORT
