#!/bin/bash
export PGPASSWORD=password

echo "Loading users"
psql postgres -h localhost -d graphmarket -f users.sql

echo "Loading products"
psql postgres -h localhost -d graphmarket -f products.sql

echo "Loading inventories"
psql postgres -h localhost -d graphmarket -f inventory.sql

echo "Loading purchases"
psql postgres -h localhost -d graphmarket -f purchases.sql

echo "Loading reviews"
psql postgres -h localhost -d graphmarket -f reviews.sql
