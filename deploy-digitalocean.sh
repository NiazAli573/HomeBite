#!/bin/bash
# HomeBite DigitalOcean Automated Setup Script
# Run this script on your DigitalOcean Droplet as root
# curl -fsSL https://path-to-raw-script | bash

set -e  # Exit on error

echo "================================"
echo "HomeBite DigitalOcean Setup"
echo "================================"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run this script as root${NC}"
    exit 1
fi

# Ask for configuration
echo -e "${YELLOW}Configuration Required${NC}"
read -p "Enter your domain (e.g., homebite.com): " DOMAIN
read -p "Enter your email for SSL certificate: " EMAIL
read -s -p "Enter PostgreSQL password: " DB_PASSWORD
echo ""
read -s -p "Enter Django SECRET_KEY (or press Enter to generate): " SECRET_KEY
echo ""

if [ -z "$SECRET_KEY" ]; then
    SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
fi

# Get public IP
PUBLIC_IP=$(curl -s https://api.ipify.org)

echo -e "${GREEN}Configuration:${NC}"
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo "Public IP: $PUBLIC_IP"
echo "Database Password: [HIDDEN]"

# Step 1: Update system
echo -e "${YELLOW}Step 1: Updating system...${NC}"
apt update
apt upgrade -y

# Step 2: Install dependencies
echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
apt install -y python3 python3-pip python3-venv python3-dev
apt install -y postgresql postgresql-contrib
apt install -y nginx
apt install -y supervisor
apt install -y git
apt install -y certbot python3-certbot-nginx
apt install -y curl wget

# Step 3: Create application directory
echo -e "${YELLOW}Step 3: Creating application directory...${NC}"
mkdir -p /var/www/homebite
cd /var/www/homebite

# Step 4: Clone repository
echo -e "${YELLOW}Step 4: Cloning HomeBite repository...${NC}"
git clone https://github.com/NiazAli573/HomeBite.git .

# Step 5: Setup Python virtual environment
echo -e "${YELLOW}Step 5: Setting up Python virtual environment...${NC}"
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn

# Step 6: Create logs directory
mkdir -p logs

# Step 7: Create .env file
echo -e "${YELLOW}Step 7: Creating .env file...${NC}"
cat > /var/www/homebite/.env << EOF
DEBUG=False
SECRET_KEY=$SECRET_KEY
ALLOWED_HOSTS=$DOMAIN,www.$DOMAIN,$PUBLIC_IP,localhost,127.0.0.1
DATABASE_URL=postgresql://homebite_user:$DB_PASSWORD@localhost:5432/homebite
POSTGRES_DB=homebite
POSTGRES_USER=homebite_user
POSTGRES_PASSWORD=$DB_PASSWORD
EOF

chmod 600 /var/www/homebite/.env

# Step 8: Setup PostgreSQL
echo -e "${YELLOW}Step 8: Setting up PostgreSQL...${NC}"
systemctl start postgresql
systemctl enable postgresql

sudo -u postgres psql << PSQL_EOF
CREATE DATABASE homebite;
CREATE USER homebite_user WITH PASSWORD '$DB_PASSWORD';
ALTER ROLE homebite_user SET client_encoding TO 'utf8';
ALTER ROLE homebite_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE homebite_user SET default_transaction_deferrable TO on;
ALTER ROLE homebite_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE homebite TO homebite_user;
PSQL_EOF

# Step 9: Run migrations
echo -e "${YELLOW}Step 9: Running Django migrations...${NC}"
cd /var/www/homebite
source venv/bin/activate
python manage.py migrate
python manage.py collectstatic --noinput

# Step 10: Create Gunicorn systemd service
echo -e "${YELLOW}Step 10: Creating Gunicorn service...${NC}"
cat > /etc/systemd/system/gunicorn.service << EOF
[Unit]
Description=Gunicorn application server for HomeBite
After=network.target postgresql.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/homebite
Environment="PATH=/var/www/homebite/venv/bin"
ExecStart=/var/www/homebite/venv/bin/gunicorn \
    --workers 3 \
    --worker-class sync \
    --bind unix:/var/www/homebite/gunicorn.sock \
    --log-file /var/www/homebite/logs/gunicorn.log \
    homebite.wsgi:application

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable gunicorn
systemctl start gunicorn

# Step 11: Create Nginx configuration
echo -e "${YELLOW}Step 11: Setting up Nginx...${NC}"
cat > /etc/nginx/sites-available/homebite << EOF
upstream gunicorn {
    server unix:/var/www/homebite/gunicorn.sock fail_timeout=0;
}

server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    client_max_body_size 50M;

    location /static/ {
        alias /var/www/homebite/staticfiles/;
    }

    location /media/ {
        alias /var/www/homebite/media/;
    }

    location / {
        proxy_pass http://gunicorn;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/homebite /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl start nginx

# Step 12: Setup SSL
echo -e "${YELLOW}Step 12: Setting up SSL certificate...${NC}"
certbot certonly --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# Update Nginx for HTTPS
cat > /etc/nginx/sites-available/homebite << EOF
upstream gunicorn {
    server unix:/var/www/homebite/gunicorn.sock fail_timeout=0;
}

server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    client_max_body_size 50M;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
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
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

nginx -t
systemctl reload nginx

# Step 13: Setup auto-renewal for SSL
echo -e "${YELLOW}Step 13: Setting up SSL auto-renewal...${NC}"
systemctl enable certbot.timer
systemctl start certbot.timer

# Step 14: Fix permissions
echo -e "${YELLOW}Step 14: Setting up permissions...${NC}"
chown -R www-data:www-data /var/www/homebite
chmod -R 755 /var/www/homebite

# Step 15: Verify services
echo -e "${YELLOW}Step 15: Verifying services...${NC}"
echo ""
echo -e "${GREEN}Service Status:${NC}"
systemctl status gunicorn --no-pager
echo ""
systemctl status nginx --no-pager
echo ""
systemctl status postgresql --no-pager

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Your HomeBite backend is now running at: https://$DOMAIN"
echo ""
echo "Next steps:"
echo "1. Update your frontend .env.production:"
echo "   VITE_API_URL=https://$DOMAIN/api"
echo ""
echo "2. Deploy frontend to Vercel"
echo ""
echo "3. Test signup at https://$DOMAIN (if frontend is accessible there)"
echo ""
echo "Useful commands:"
echo "  - View logs: tail -f /var/www/homebite/logs/gunicorn.log"
echo "  - Restart services: systemctl restart gunicorn"
echo "  - Update app: cd /var/www/homebite && git pull origin main"
echo ""
