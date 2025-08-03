FROM python:3.9.18-alpine3.18

# Install build-base and postgresql-dev for psycopg2
# Also install curl for health checks
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev curl

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

# Run database migrations and seed data
# Note: In production, these should be run separately for better control
RUN flask db upgrade
RUN flask seed all

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/csrf/debug || exit 1
# Expose port 5000
EXPOSE 5000

# Create a non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Change ownership of the app directory
RUN chown -R appuser:appgroup /var/www

# Switch to non-root user
USER appuser

# Run the application with optimized settings for production
CMD gunicorn app:app --bind 0.0.0.0:5000 --workers 4 --timeout 120 --keep-alive 2 --max-requests 1000 --max-requests-jitter 100