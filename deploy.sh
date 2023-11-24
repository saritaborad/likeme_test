#!/bin/bash

# Set the deployment directory on the server
deploy_dir="piks.in:/var/www/piks/public_html/likeme_test"

# Save the 'uploads' folder path
uploads_folder="$deploy_dir/backend/uploads"

# Check if the 'uploads' folder exists on the server
if [ -d "$uploads_folder" ]; then
  # If it exists, move it to a temporary location
  ssh $deploy_dir "mv $uploads_folder $deploy_dir/uploads_temp"
fi

# Pull the latest changes from the remote repository (assuming the branch is 'master')
git pull origin master

# Navigate to the backend directory on the server
ssh $deploy_dir "cd backend && npm install && pm2 restart likeme_test"

# Navigate to the frontend directory on the server
ssh $deploy_dir "cd frontend && npm install && npm run build"

# Copy the build files to the deployment directory on the server
scp -r build/* $deploy_dir

# Check if the 'uploads' folder was moved to a temporary location
if [ -d "$deploy_dir/uploads_temp" ]; then
  # If it was moved, restore it to its original location
  ssh $deploy_dir "mv $deploy_dir/uploads_temp $uploads_folder"
fi

# Optional: Remove the frontend directory locally if you no longer need it
# rm -r /path/to/your/local/repository/frontend
