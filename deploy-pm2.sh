#!/bin/bash

# Barbitch Client - PM2 Deploy Script
# This script updates and restarts the Next.js application

set -e

echo "🚀 Starting Barbitch Client deployment..."

# Navigate to project directory
cd /opt/barbitch-client

# Pull latest changes (if using git)
echo "📥 Pulling latest changes from Git..."
git pull origin main || echo "⚠️  Git pull skipped (not a git repo or no changes)"

# Install/update dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Restart PM2 process
echo "🔄 Restarting PM2 process..."
pm2 restart barbitch-client || pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

echo "✅ Deployment completed successfully!"
echo "📊 Check status: pm2 status"
echo "📋 View logs: pm2 logs barbitch-client"
