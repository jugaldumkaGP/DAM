#!/bin/bash
pip install ipdb
pip install django-cors-headers
cd /application/backend
echo "Apply database migrations"
python /application/backend/manage.py migrate

echo "Starting Django App Server"
python /application/backend/manage.py runserver 0.0.0.0:8000
