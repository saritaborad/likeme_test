#!/bin/bash

# Set the deployment directory
deploy_dir="/var/www/piks/public_html/likeme_test"

# Navigate to the backend directory
cd $deploy_dir/backend

# Pull the latest changes from the Git repository
git pull origin main

# Install Node.js dependencies
npm install

# Restart your Node.js server
pm2 restart your-backend-app

# Navigate to the frontend directory
cd $deploy_dir

# Pull the latest changes from the Git repository
git pull origin main

# Build the React app
npm install
npm run build

# Reload Apache (if needed)
sudo service apache2 reload
