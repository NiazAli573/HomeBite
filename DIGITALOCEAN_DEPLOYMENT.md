# HomeBite Deployment Guide - DigitalOcean Droplet

## Quick Overview
You'll deploy:
- **Backend (Django)** → DigitalOcean Droplet
- **Frontend (React)** → Vercel (keep as is) OR DigitalOcean App Platform
- **Database (PostgreSQL)** → DigitalOcean Managed Database OR local on Droplet
- **Web Server (Nginx)** → Reverse proxy for Django
- **Process Manager (Gunicorn)** → Run Django app

---

## PART 1: CREATE DIGITALOCEAN DROPLET

### Step 1: Create Droplet
1. Go to https://cloud.digitalocean.com
2. Click **Create** → **Droplets**
3. Configure:
   - **Choose Image:** Ubuntu 22.04 LTS (or latest LTS)
   - **Choose Size:** Basic ($6/month minimum - sufficient for HomeBite)
   - **Choose Region:** Closest to your users
   - **Authentication:** SSH key (recommended) or Password
   - **Hostname:** homebite-backend
4. Click **Create Droplet**
5. Wait 1-2 minutes for creation

### Step 2: Connect to Droplet
```bash
# On your computer, SSH into the Droplet
ssh root@YOUR_DROPLET_IP

# Replace YOUR_DROPLET_IP with the IP shown in DigitalOcean dashboard
```

---

## PART 2: SETUP DROPLET ENVIRONMENT

### Step 1: Update System
```bash
apt update
apt upgrade -y
```

### Step 2: Install Required Software
```bash
# Python and development tools
apt install -y python3 python3-pip python3-venv python3-dev

# PostgreSQL client (if using managed database)
# Or PostgreSQL server (if using local database)
apt install -y postgresql postgresql-contrib

# Nginx (web server)
apt install -y nginx

# Supervisor (process manager alternative to systemd)
apt install -y supervisor

# Git (to clone your repo)
apt install -y git

# Certbot (for SSL/HTTPS)
apt install -y certbot python3-certbot-nginx
```

### Step 3: Create Application Directory
```bash
# Create directory for HomeBite
mkdir -p /var/www/homebite
cd /var/www/homebite

# Clone your GitHub repository
git clone https://github.com/NiazAli573/HomeBite.git .

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn
```

### Step 4: Create Environment File
```bash
# Create .env file
nano .env
```

Add these variables:
```
DEBUG=False
SECRET_KEY=your-super-secret-key-generate-one
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,droplet-ip
DATABASE_URL=postgresql://user:password@localhost:5432/homebite
POSTGRES_DB=homebite
POSTGRES_USER=homebite_user
POSTGRES_PASSWORD=strong-password-here
```

Generate SECRET_KEY:
```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Press: Ctrl+X, then Y, then Enter to save

### Step 5: Setup PostgreSQL

**Option A: Local PostgreSQL on Droplet**
```bash
# Start PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE homebite;
CREATE USER homebite_user WITH PASSWORD 'strong-password-here';
ALTER ROLE homebite_user SET client_encoding TO 'utf8';
ALTER ROLE homebite_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE homebite_user SET default_transaction_deferrable TO on;
ALTER ROLE homebite_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE homebite TO homebite_user;
\q
EOF
```

**Option B: DigitalOcean Managed PostgreSQL**
1. Go to DigitalOcean → **Create** → **Databases**
2. Create PostgreSQL cluster
3. Get connection string and add to .env as DATABASE_URL

### Step 6: Run Django Migrations
```bash
cd /var/www/homebite
source venv/bin/activate

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Create superuser (optional, for admin)
python manage.py createsuperuser
```

---

## PART 3: SETUP GUNICORN

### Step 1: Test Gunicorn Locally
```bash
cd /var/www/homebite
source venv/bin/activate

# Test running with Gunicorn
gunicorn --bind 0.0.0.0:8000 homebite.wsgi:application
```

You should see: `[INFO] Listening at: http://0.0.0.0:8000`

Press Ctrl+C to stop

### Step 2: Create Systemd Service
```bash
# Create service file
nano /etc/systemd/system/gunicorn.service
```

Add this content:
```ini
[Unit]
Description=Gunicorn application server for HomeBite
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/homebite
ExecStart=/var/www/homebite/venv/bin/gunicorn \
    --workers 3 \
    --worker-class sync \
    --bind unix:/var/www/homebite/gunicorn.sock \
    homebite.wsgi:application

[Install]
WantedBy=multi-user.target
```

Press: Ctrl+X, Y, Enter

```bash
# Enable and start service
systemctl daemon-reload
systemctl enable gunicorn
systemctl start gunicorn

# Check status
systemctl status gunicorn
```

---

## PART 4: SETUP NGINX

### Step 1: Create Nginx Configuration
```bash
# Create config file
nano /etc/nginx/sites-available/homebite
```

Add this content (replace `your-domain.com` with your actual domain):
```nginx
upstream gunicorn {
    server unix:/var/www/homebite/gunicorn.sock fail_timeout=0;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    client_max_body_size 50M;

    location /static/ {
        alias /var/www/homebite/staticfiles/;
    }

    location /media/ {
        alias /var/www/homebite/media/;
    }

    location / {
        proxy_pass http://gunicorn;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Press: Ctrl+X, Y, Enter

### Step 2: Enable Site
```bash
# Create symlink
ln -s /etc/nginx/sites-available/homebite /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Start Nginx
systemctl enable nginx
systemctl start nginx
```

### Step 3: Setup SSL with Certbot
```bash
# Get SSL certificate (replace email and domain)
certbot certonly --nginx -d your-domain.com -d www.your-domain.com --email your-email@example.com

# Update Nginx config to use HTTPS
nano /etc/nginx/sites-available/homebite
```

Replace the entire content with:
```nginx
upstream gunicorn {
    server unix:/var/www/homebite/gunicorn.sock fail_timeout=0;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    client_max_body_size 50M;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location /static/ {
        alias /var/www/homebite/staticfiles/;
    }

    location /media/ {
        alias /var/www/homebite/media/;
    }

    location / {
        proxy_pass http://gunicorn;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Test and reload
nginx -t
systemctl reload nginx
```

---

## PART 5: UPDATE FRONTEND

### For Vercel Frontend (Current)
Update `frontend/.env.production`:
```
VITE_API_URL=https://your-domain.com/api
```

Then redeploy to Vercel.

### For DigitalOcean Hosted Frontend
Deploy frontend to DigitalOcean App Platform or static hosting.

---

## PART 6: VERIFY DEPLOYMENT

### Test Backend
```bash
# SSH into Droplet
ssh root@YOUR_DROPLET_IP

# Check Gunicorn
systemctl status gunicorn

# Check Nginx
systemctl status nginx

# Check logs
tail -f /var/www/homebite/logs/gunicorn.log
```

### Test API
```bash
# From your computer
curl https://your-domain.com/api/auth/csrf/
# Should return valid JSON response
```

### Test Signup
1. Update frontend .env.production with new backend URL
2. Deploy frontend
3. Go to frontend URL
4. Try signup - should work!

---

## MAINTENANCE COMMANDS

```bash
# View logs
tail -f /var/www/homebite/logs/gunicorn.log
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Restart services
systemctl restart gunicorn
systemctl restart nginx

# Pull latest code
cd /var/www/homebite
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
systemctl restart gunicorn

# Check disk space
df -h

# Monitor resources
htop
```

---

## COST COMPARISON

| Service | Cost | Best For |
|---------|------|----------|
| DigitalOcean Droplet ($6/mo) + Managed DB ($15/mo) | $21/mo | Full control, scalable |
| Railway (free tier) | $0-5/mo | Quick setup, auto-scaling |
| AWS EC2 | Variable | Enterprise |

---

## TROUBLESHOOTING

### Gunicorn won't start
```bash
# Check logs
journalctl -u gunicorn -n 50
# Fix issues and restart
systemctl restart gunicorn
```

### Nginx 502 Bad Gateway
- Check Gunicorn is running: `systemctl status gunicorn`
- Check socket file exists: `ls -la /var/www/homebite/gunicorn.sock`
- Restart both: `systemctl restart gunicorn nginx`

### Static files not loading
```bash
cd /var/www/homebite
source venv/bin/activate
python manage.py collectstatic --clear --noinput
systemctl restart nginx
```

### SSL certificate issues
```bash
# Renew certificate
certbot renew --dry-run
certbot renew
```

---

## NEXT STEPS

1. Create DigitalOcean Droplet
2. SSH in and follow PART 1-4 above
3. Configure domain name (A record pointing to Droplet IP)
4. Test API endpoint
5. Update frontend .env.production
6. Test complete flow

**Estimated time:** 30-45 minutes for full setup

Need help with any step? Let me know!
