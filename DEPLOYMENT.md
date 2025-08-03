# Deployment Guide: Docker & Render.com

This guide covers deploying the Flask e-commerce application with burger products and CSRF debugging capabilities using Docker and Render.com.

## 🍔 Features Added

- **Burger Products**: Added 6 delicious burger varieties to the product catalog
- **CSRF Debugger**: Comprehensive CSRF token debugging endpoints
- **Docker Support**: Full containerization with development and production configurations
- **Render.com Ready**: Optimized deployment configuration for Render.com

## 🐳 Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- Git repository cloned

### Development Environment

1. **Start all services**:
   ```bash
   docker-compose up --build
   ```

2. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - CSRF Debugger: http://localhost:5000/api/csrf/debug
   - Database: localhost:5432

3. **View logs**:
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

4. **Stop services**:
   ```bash
   docker-compose down
   ```

### Production Build

1. **Build production images**:
   ```bash
   # Backend
   docker build -t flask-burger-app .
   
   # Frontend
   cd react-vite
   docker build -t react-burger-frontend .
   ```

2. **Run production containers**:
   ```bash
   # Database
   docker run -d --name postgres-db \
     -e POSTGRES_DB=flask_app \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=your_password \
     -p 5432:5432 postgres:13
   
   # Backend
   docker run -d --name flask-backend \
     -e DATABASE_URL=postgresql://postgres:your_password@postgres-db:5432/flask_app \
     -e SECRET_KEY=your_secret_key \
     -e FLASK_ENV=production \
     --link postgres-db \
     -p 5000:5000 flask-burger-app
   
   # Frontend
   docker run -d --name react-frontend \
     --link flask-backend:backend \
     -p 80:80 react-burger-frontend
   ```

## 🚀 Render.com Deployment

### Prerequisites
- Render.com account
- GitHub repository connected to Render

### Automatic Deployment

1. **Connect Repository**:
   - Go to Render.com dashboard
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing this project

2. **Deploy with Blueprint**:
   - Render will automatically detect the `render.yaml` file
   - Review the configuration:
     - Web service: Flask application
     - Database: PostgreSQL
     - Health check: `/api/csrf/debug`
   - Click "Apply" to start deployment

3. **Monitor Deployment**:
   - Watch the build logs for "Database seeded with burger products!"
   - Verify health check passes at `/api/csrf/debug`

### Manual Deployment

1. **Create Web Service**:
   - Service Type: Web Service
   - Runtime: Docker
   - Dockerfile Path: `./Dockerfile`
   - Health Check Path: `/api/csrf/debug`

2. **Environment Variables**:
   ```
   FLASK_APP=app
   FLASK_ENV=production
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=postgresql://username:password@hostname:port/database_name
   SCHEMA=flask_schema
   WTF_CSRF_ENABLED=true
   WTF_CSRF_TIME_LIMIT=3600
   ```

3. **Create PostgreSQL Database**:
   - Service Type: PostgreSQL
   - Database Name: python-group-project-db
   - User: your-database-username
   - Password: your-database-password

## 🔧 CSRF Debugger Endpoints

### Debug Information
```
GET /api/csrf/debug
```
Returns comprehensive CSRF configuration and status information.

### Validate Token
```
POST /api/csrf/validate
Content-Type: application/json

{
  "csrf_token": "your_token_here"
}
```
Validates a CSRF token and returns validation status.

### Test Endpoint
```
POST /api/csrf/test-endpoint
X-CSRFToken: your_token_here
Content-Type: application/json

{
  "test_data": "value"
}
```
Tests CSRF protection end-to-end.

## 🍔 Burger Products

The application now includes 6 burger varieties:
- Classic Beef Burger
- Double Cheese Burger
- Veggie Deluxe Burger
- BBQ Bacon Burger
- Spicy Jalapeño Burger
- Mushroom Swiss Burger

These are automatically seeded when running:
```bash
flask seed all
```

## 🔍 Troubleshooting

### Docker Issues

1. **Port conflicts**:
   ```bash
   # Check what's using the port
   lsof -i :5000
   lsof -i :5173
   ```

2. **Database connection issues**:
   ```bash
   # Check database logs
   docker-compose logs db
   
   # Reset database
   docker-compose down -v
   docker-compose up --build
   ```

3. **CSRF issues**:
   - Visit `/api/csrf/debug` to check configuration
   - Verify `WTF_CSRF_ENABLED` environment variable
   - Check browser cookies and headers

### Render.com Issues

1. **Build failures**:
   - Check build logs for missing dependencies
   - Verify Dockerfile syntax
   - Ensure all required files are committed

2. **Health check failures**:
   - Verify `/api/csrf/debug` endpoint is accessible
   - Check application logs for startup errors
   - Ensure database connection is established

3. **CSRF token issues**:
   - Check environment variables are set correctly
   - Verify `SECRET_KEY` is properly generated
   - Test with `/api/csrf/validate` endpoint

## 📊 Monitoring

### Health Checks
- Docker: Built-in health checks using curl
- Render.com: Automatic health monitoring at `/api/csrf/debug`

### Logs
- Docker: `docker-compose logs -f`
- Render.com: Available in service dashboard

### Performance
- Gunicorn configured with 4 workers for production
- Connection pooling and request limits configured
- Nginx caching for static assets in frontend

## 🔐 Security

- Non-root user in Docker containers
- CSRF protection enabled and debuggable
- Security headers configured in nginx
- Environment variables for sensitive data
- Health checks don't expose sensitive information

## 📝 Next Steps

1. Set up CI/CD pipeline with GitHub Actions
2. Configure monitoring and alerting
3. Set up SSL certificates for production
4. Implement database backups
5. Add performance monitoring