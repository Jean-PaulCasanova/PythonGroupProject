FROM python:3.9.18-alpine3.18

# Add build tools and Postgres client
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev postgresql-client

ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

WORKDIR /var/www

COPY requirements.txt .
RUN pip install -r requirements.txt
RUN pip install psycopg2

COPY . .

RUN flask db downgrade base
RUN flask db upgrade

# 🔥 Drop users table to force clean rebuild
RUN psql "$DATABASE_URL" -c "DROP TABLE IF EXISTS users CASCADE;"

# Re-run upgrade to rebuild users table properly
RUN flask db upgrade
RUN flask seed all

CMD gunicorn app:app