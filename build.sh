#!/bin/bash

# Absolute path for root dir where bash is located
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

RECREATE_DB=false

# Parse through arguments
while [[ $# -gt 0 ]]; do  # while there are still arguments

  # check next argument and process it accordingly
  # we use shift to pop the first argument from the argument list
  case "$1" in
    --recreate-db)
      shift
      RECREATE_DB=true
      ;;
    --help|*)
      echo ""
      echo "  --help                  show this help message and exit "
      echo "  --recreate-db           if set database will be recreated with default user"
      echo ""
      exit 1
  esac
done

# Go to root
cd ${ROOT_DIR}

# Build containers
echo "--------Building containers--------"
docker-compose -f docker-compose.yml up -d --build

# Recreate db
if [ "$RECREATE_DB" = "true" ]; then
  echo "--------Recreating database--------"
  docker exec home_presence_back bash -c "python3 manage.py recreate-db"
  docker exec home_presence_back bash -c "python3 manage.py seed-db"
fi

# Build finished
echo "--------Full building finished--------"
