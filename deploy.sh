#!/bin/bash

# Set the deployment directory
deploy_dir="/var/www/piks/public_html/likeme_test"

# Save the 'uploads' folder path
uploads_folder="$deploy_dir/backend/uploads"

# Check if the 'uploads' folder exists on the server
if [ -d "$uploads_folder" ]; then
  # If it exists, move it to a temporary location
  mv "$uploads_folder" "$deploy_dir/uploads_temp"
fi

# Navigate to the repository root
cd $deploy_dir

# Pull the latest changes from the remote repository (assuming the branch is 'master')
git pull origin master

# Navigate to the backend directory
cd backend

# Install Node.js dependencies
npm install

# Restart your Node.js server (assuming you are using pm2)
pm2 restart likeme_test

# Navigate to the frontend directory
cd ../frontend

# Install frontend dependencies and build the React app
npm install
npm run build


# Copy the build files to the deployment directory
cp -R build/ $deploy_dir

# Check if the 'uploads' folder was moved to a temporary location
if [ -d "$deploy_dir/uploads_temp" ]; then
  # If it was moved, restore it to its original location
  mv "$deploy_dir/uploads_temp" "$uploads_folder"
fi

# Optional: Remove the frontend directory if you no longer need it
rm -r $deploy_dir/frontend
