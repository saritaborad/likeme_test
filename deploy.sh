#!/bin/bash

# Set the deployment directory on the server
deploy_host="piks.in"
deploy_path="/var/www/piks/public_html/likeme_test"
ssh_key_path="$HOME/.ssh/id_rsa"  # Adjust the path based on your actual key location

# Save the 'uploads' folder path
uploads_folder="$deploy_path/backend/uploads"

# Ensure correct permissions for the SSH key
chmod 600 $ssh_key_path

# Check if the 'uploads' folder exists on the server
ssh -i $ssh_key_path root@$deploy_host "[ -d $uploads_folder ]"
if [ $? -eq 0 ]; then
  # If it exists, move it to a temporary location
  ssh -i $ssh_key_path root@$deploy_host "mv $uploads_folder $deploy_path/uploads_temp"
fi

# Pull the latest changes from the remote repository (assuming the branch is 'master')
git pull origin master

# Use git diff to get the list of changed files for backend
changed_files_backend=$(git diff --name-only HEAD@{1} HEAD -- backend)
# Copy only the changed files to the server for backend
for file in $changed_files_backend; do
  rsync -avz -e "ssh -i $ssh_key_path" $file root@$deploy_path/backend
done

ssh -i $ssh_key_path root@$deploy_host "cd $deploy_path/backend && npm install &&  /root/.nvm/versions/node/v19.7.0/bin/pm2 restart likeme_test"

changed_files_backend=$(git diff --name-only HEAD@{1} HEAD -- frontend/build)
# Copy only the changed files to the server for backend
for file in $changed_files_frontend_build; do
  rsync -avz -e "ssh -i $ssh_key_path" $file root@$deploy_path
done

# rsync -avz -e "ssh -i $ssh_key_path"  frontend/build/ root@$deploy_dir

# Restore the 'uploads' folder if it was moved
ssh -i $ssh_key_path root@$deploy_host "[ -d $deploy_path/uploads_temp ]"
if [ $? -eq 0 ]; then
  ssh -i $ssh_key_path root@$deploy_host "mv $deploy_path/uploads_temp $uploads_folder"
fi
# Remove the build folder on the server (if needed)
# ssh -i $ssh_key_path root@$deploy_host "rm -r $deploy_path/backend/build"
