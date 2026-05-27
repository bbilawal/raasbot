#!/bin/bash
# Hostinger VPS setup script for Raasbot
# Run as root on a fresh Ubuntu 22.04 VPS

set -e

echo "=== Raasbot VPS Setup ==="
echo "Company: 13698491 Canada Inc"

# Update system
apt-get update && apt-get upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt-get install -y nginx

# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Create app directory
mkdir -p /var/www/raasbot
mkdir -p /var/log/raasbot

# Create deploy user
useradd -m -s /bin/bash deploy || true
usermod -aG sudo deploy

# Clone repo (update with your repo URL)
cd /var/www
git clone https://github.com/bbilawal/raasbot.git raasbot
chown -R deploy:deploy /var/www/raasbot

# Copy nginx config
cp /var/www/raasbot/nginx.conf /etc/nginx/sites-available/raasbot
ln -sf /etc/nginx/sites-available/raasbot /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t && systemctl reload nginx

echo ""
echo "=== Next Steps ==="
echo "1. Create .env.local in /var/www/raasbot with your env vars"
echo "2. Run: cd /var/www/raasbot && npm ci && npm run build"
echo "3. Run: pm2 start ecosystem.config.js && pm2 save && pm2 startup"
echo "4. Run: certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo "5. Point GoDaddy DNS A record to this server IP"
