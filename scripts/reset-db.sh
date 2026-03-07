#!/bin/bash

# CureForest Database Reset Script
# This script will completely reset the database by removing the Docker volume and recreating it.
# WARNING: This will DELETE ALL DATA!

echo "========================================="
echo "  CureForest Database Reset Script"
echo "========================================="
echo ""
echo "WARNING: This will DELETE ALL DATA in the database!"
echo ""

read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Aborted."
  exit 1
fi

echo ""
echo "Stopping containers..."
docker-compose down

echo ""
echo "Removing database volume..."
docker volume rm cureforest_postgres_data 2>/dev/null || echo "Volume not found, skipping..."

echo ""
echo "Starting fresh containers..."
docker-compose up -d

echo ""
echo "Waiting for database to initialize (30 seconds)..."
sleep 30

echo ""
echo "========================================="
echo "  Database reset complete!"
echo "========================================="
echo ""
echo "Initial admin account:"
echo "  Email:    admin@cureforest.kr"
echo "  Password: admin123!"
echo ""
echo "Please change the password after first login."
echo ""
