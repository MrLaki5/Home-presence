#!/bin/bash

# Absolute path for root dir where bash is located
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

RASPBERRY_IP=false
INSTALL_PACKAGES=false

# Parse through arguments
while [[ $# -gt 0 ]]; do  # while there are still arguments

  # check next argument and process it accordingly
  # we use shift to pop the first argument from the argument list
  case "$1" in
    --raspberry-ip)
      shift
      RASPBERRY_IP=$1
      shift
      ;;
    --install-packages)
      shift
      INSTALL_PACKAGES=true
      ;;
    --help|*)
      echo ""
      echo "  --help                  show this help message and exit "
      echo "  --raspberry-ip <IP>     ip address of raspberry pi (required)"
      echo "  --install-packages      if set npm packages will be installed first"
      echo ""
      exit 1
  esac
done

# Check if ip is present
if [ "$RASPBERRY_IP" = "false" ]; then
    echo "Raspberry IP missing, run --help for more info!"
    exit 2
fi

# Go to build
cd ${ROOT_DIR}/home-presence-front

# Clean last build
rm -rf build

# Install packages
if [ "INSTALL_PACKAGES" = "true" ]; then
  echo "--------Installing npm packages--------"
  npm install
fi

# Build frontend
echo "--------Building frontend--------"
npm run build

# Create env file
echo "--------Creating env file--------"
cp .env ./build
sed -i "s/REACT_APP_SERVER_ADDRESS=.*/REACT_APP_SERVER_ADDRESS=$RASPBERRY_IP/" ./build/.env

# Got to nginx frontend build
cd ${ROOT_DIR}/nginx

# Move build to nginx
echo "--------Copy build to nginx--------"
mv ./build/.gitignore ./.gitignore
rm -rf ./build
cp  -rv ${ROOT_DIR}/home-presence-front/build ./build
mv ./.gitignore ./build/.gitignore

# Build finished
echo "--------Full frontend building finished--------"
