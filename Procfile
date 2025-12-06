release: python manage.py migrate --noinput && python manage.py collectstatic --noinput && python manage.py create_test_users
web: gunicorn homebite.wsgi:application --bind 0.0.0.0:$PORT
