FROM python:3.9.18-alpine3.18

# Add build tools and Postgres client
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev postgresql-client

# Accept ENV variables from Render
ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

# Expose env vars at runtime
ENV FLASK_APP=$FLASK_APP
ENV FLASK_ENV=$FLASK_ENV
ENV DATABASE_URL=$DATABASE_URL
ENV SCHEMA=$SCHEMA
ENV SECRET_KEY=$SECRET_KEY

WORKDIR /var/www

# Install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN pip install psycopg2

# Copy rest of project
COPY . .

# Drop schema entirely (instead of just users table)
RUN psql "$DATABASE_URL" -c "DROP SCHEMA IF EXISTS $SCHEMA CASCADE;"
RUN psql "$DATABASE_URL" -c "CREATE SCHEMA $SCHEMA;"

# Reapply migrations and seed fresh
RUN flask db upgrade
RUN flask seed all

CMD gunicorn app:app