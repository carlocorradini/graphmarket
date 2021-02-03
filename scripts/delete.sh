#!/bin/bash
export PGPASSWORD=password

echo "Deleting reviews"
psql postgres -h localhost -d graphmarket -c 'DELETE FROM public."review"'

echo "Deleting purchases"
psql postgres -h localhost -d graphmarket -c 'DELETE FROM public."purchase"'

echo "Deleting inventories"
psql postgres -h localhost -d graphmarket -c 'DELETE FROM public."inventory"'

echo "Deleting users"
psql postgres -h localhost -d graphmarket -c 'DELETE FROM public."user";'

echo "Deleting products"
psql postgres -h localhost -d graphmarket -c 'DELETE FROM public."product"'
