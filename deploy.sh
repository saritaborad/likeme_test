#!/bin/bash

# Set the deployment directory on the server
deploy_host="piks.in"
deploy_path="/var/www/piks/public_html/likeme_test"
deploy_dir="$deploy_host:$deploy_path"
ssh_key_path="$HOME/.ssh/id_rsa"  # Adjust the path based on your actual key location


# Save the 'uploads' folder path
uploads_folder="$deploy_path/backend/uploads"

# Check if the 'uploads' folder exists on the server
if ssh -i $ssh_key_path $deploy_host "[ -d $uploads_folder ]"; then
  # If it exists, move it to a temporary location
  ssh -i $ssh_key_path $deploy_host "mv $uploads_folder $deploy_path/uploads_temp"
fi

# Pull the latest changes from the remote repository (assuming the branch is 'master')
git pull origin master

# Navigate to the backend directory on the server
ssh -i $ssh_key_path $deploy_host "cd $deploy_path/backend && npm install && pm2 restart likeme_test"

# Navigate to the frontend directory on the server
ssh -i $ssh_key_path $deploy_host "cd $deploy_path/frontend && npm install && npm run build"

# Copy the build files to the deployment directory on the server
scp -i $ssh_key_path -r build/* $deploy_dir

# Check if the 'uploads' folder was moved to a temporary location
if ssh -i $ssh_key_path $deploy_host "[ -d $deploy_path/uploads_temp ]"; then
  # If it was moved, restore it to its original location
  ssh -i $ssh_key_path $deploy_host "mv $deploy_path/uploads_temp $uploads_folder"
fi

# Optional: Remove the frontend directory locally if you no longer need it
# rm -r /path/to/your/local/repository/frontend
