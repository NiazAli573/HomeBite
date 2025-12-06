# HomeBite - Railway PostgreSQL Setup Guide

## Overview
This guide explains how to set up HomeBite with Railway's PostgreSQL database for production deployment.

## Prerequisites
- Railway account (https://railway.app)
- Railway CLI installed or using Railway Dashboard
- Git repository connected to Railway

## Step 1: Create PostgreSQL Database on Railway

### Via Railway Dashboard
1. Go to [railway.app](https://railway.app)
2. Log in to your account
3. Create a new project
4. Add PostgreSQL plugin:
   - Click "Create New" → Select "PostgreSQL"
   - Copy the database connection details

### Connection Details Provided by Railway
Railway will provide you with environment variables:
- `DATABASE_URL` - Full PostgreSQL connection string (use this!)
- `POSTGRES_URL` - Alternative name
- `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` - Individual components

## Step 2: Add Environment Variables to Railway

In your Railway project dashboard:

### Required Variables
```
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app.railway.app,*.railway.app
DATABASE_URL=postgresql://user:password@host:port/database
```

### Optional Variables (if using storage)
```
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_STORAGE_BUCKET_NAME=your-bucket
```

## Step 3: Prepare Your Application

### Update settings.py (Already Done ✓)
The application already supports `DATABASE_URL` from environment:

```python
import dj_database_url

DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL)
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
```

### Required Dependencies (Already in requirements.txt ✓)
- `psycopg2-binary>=2.9` - PostgreSQL adapter
- `dj-database-url>=2.1` - Parse DATABASE_URL
- `python-decouple>=3.8` - Load environment variables

## Step 4: Deploy to Railway

### Option A: Using Railway CLI
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize and deploy
railway init
railway up
```

### Option B: Connect GitHub Repository
1. Go to Railway Dashboard
2. Create new project
3. Select "Deploy from GitHub"
4. Connect your GitHub repository
5. Select the repository and branch
6. Railway will auto-deploy on every push to main

## Step 5: Run Migrations on Railway

After deployment, run migrations on the PostgreSQL database:

### Via Railway CLI
```bash
railway run python manage.py migrate
```

### Via Railway Dashboard
1. Go to your project
2. Select the Django service
3. Open "Deployments" tab
4. Find latest deployment
5. Click "View Logs" to see deployment status

### Manual Migration (if needed)
```bash
# Connect to Railway database
psql postgresql://user:password@host:port/database

# Then run migrations via your deployment console
```

## Step 6: Create Superuser on Railway

### Via Railway CLI
```bash
railway run python manage.py createsuperuser
```

### Via Railway Dashboard
1. Go to Deployments
2. Select your service
3. Open "Shell/Console"
4. Run the createsuperuser command

## Local Development with Railway PostgreSQL

To test locally with Railway's PostgreSQL database:

### 1. Update .env file
```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://postgres:vEtvgrdQrhIroHdeWKXIjnYPCNPmFCrh@gondola.proxy.rlwy.net:51248/railway
```

### 2. Run Migrations Locally
```bash
python manage.py migrate
```

### 3. Run Development Server
```bash
python manage.py runserver
```

### Important: Firewall/Network Issues
If you get connection errors:
1. Check your local machine's firewall
2. Verify the connection string is correct
3. Ensure Railway database is running (check Railway Dashboard)
4. Railway may have network restrictions - check Railway documentation

## Troubleshooting

### Connection Refused
- **Problem**: `server closed the connection unexpectedly`
- **Solution**: 
  - Verify connection string in `.env`
  - Check if Railway PostgreSQL service is running
  - Try from Railway's console instead of local machine

### Migrations Failed
```bash
# Check migration status
python manage.py showmigrations

# Apply specific migration
python manage.py migrate accounts 0001

# View migration details
python manage.py migrate --plan
```

### Database Locked
```bash
# Clear stale connections
python manage.py dbshell  # Opens psql console, then \q to exit

# Or view active connections:
SELECT * FROM pg_stat_activity;
```

### Static Files Not Found
Configure static files storage:
```python
# In settings.py
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STORAGES = {
    "default": "django.core.files.storage.FileSystemStorage",
    "staticfiles": "django.core.files.storage.StaticFilesStorage",
}
```

## Scaling Considerations

### Database Optimization
- Monitor query performance in Railway Dashboard
- Add database indexes for frequently queried fields
- Use connection pooling for high traffic

### Media Files
For production media/image uploads:
1. Use Railway's S3-compatible storage, or
2. Use AWS S3, DigitalOcean Spaces, or Cloudinary
3. Update Django settings to use cloud storage backend

## Monitoring & Maintenance

### View Logs
```bash
railway logs -f  # Follow logs in real-time
```

### Database Backups
- Railway provides automatic backups (check documentation)
- Manually backup: `pg_dump <connection_string> > backup.sql`

### Performance Monitoring
- Check Railway Dashboard for database metrics
- Monitor API response times
- Track error rates in logs

## Next Steps

1. ✅ Add DATABASE_URL to Railway environment
2. ✅ Deploy the application
3. ✅ Run migrations: `railway run python manage.py migrate`
4. ✅ Create superuser: `railway run python manage.py createsuperuser`
5. ✅ Test API endpoints with PostgreSQL data
6. Set up continuous deployment via GitHub webhooks
7. Configure automated backups
8. Monitor application performance

## Additional Resources
- [Railway Documentation](https://docs.railway.app)
- [Django PostgreSQL Setup](https://docs.djangoproject.com/en/5.2/ref/databases/#postgresql-notes)
- [dj-database-url Docs](https://github.com/jacobian/dj-database-url)
