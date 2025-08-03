import os
import logging
from flask import Flask, render_template, request, session, redirect, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.product_routes import product_routes
from .api.cart_routes import cart_routes
from .api.reviews_routes import review_routes
from .api.wishlist_routes import wishlist_routes
from .api.csrf_debug import csrf_debug
from .seeds import seed_commands
from .config import Config

app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='')

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

# Add CLI seed command
app.cli.add_command(seed_commands)

# Load app configuration
app.config.from_object(Config)

# Initialize CSRF protection
csrf = CSRFProtect(app)

# Register blueprints
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(product_routes, url_prefix='/api/products')
app.register_blueprint(cart_routes, url_prefix='/api/cart')
app.register_blueprint(review_routes, url_prefix='/api')
app.register_blueprint(wishlist_routes, url_prefix='/api/wishlist')
app.register_blueprint(csrf_debug)

# Initialize the database and migration
db.init_app(app)
Migrate(app, db)

# Enable CORS debug logging
logging.getLogger('flask_cors').level = logging.DEBUG

# Enable CORS
if os.environ.get('FLASK_ENV') == 'production':
    CORS(app, supports_credentials=True)
else:
    # Allow all origins for development debugging
    CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3966", "http://localhost:3967"], 
         allow_headers=["Content-Type", "Authorization", "X-CSRFToken"], 
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Enable Flask-CORS debug logging
logging.getLogger('flask_cors').level = logging.DEBUG

# ✅ Redirect fix: Prevent preflight OPTIONS requests from getting redirected
@app.before_request
def https_redirect():
    if request.method == 'OPTIONS':
        return '', 200  # ✅ This line fixes the CORS preflight redirect issue
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            return redirect(url, code=301)

# CSRF token injection into cookies
@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get('FLASK_ENV') == 'production' else None,
        httponly=False
    )
    return response

# API documentation route
@app.route("/health")
def health_check():
    """
    Simple health check endpoint
    """
    return {"status": "healthy", "message": "Application is running"}

@app.route("/api/test")
def test_route():
    """
    Simple test route to verify API is working
    """
    return {"message": "API is working!", "status": "success"}

@app.route("/api/products/test")
def test_products_route():
    """
    Test route to check database connection without querying products
    """
    try:
        from app.models import db
        # Simple database connection test
        db.session.execute('SELECT 1')
        return {"message": "Database connection working!", "status": "success"}
    except Exception as e:
        return {"error": str(e), "status": "error"}, 500

@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = {
        rule.rule: [
            [method for method in rule.methods if method in acceptable_methods],
            app.view_functions[rule.endpoint].__doc__
        ]
        for rule in app.url_map.iter_rules() if rule.endpoint != 'static'
    }
    return route_list

@app.route("/api/csrf/restore", methods=["GET"])
def restore_csrf():
    return {"csrf_token": generate_csrf()}

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

# React frontend catch-all route - MUST be last to avoid intercepting API routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@csrf.exempt
def react_root(path):
    """
    Serves the React frontend build
    """
    # Skip API routes to ensure they're handled by their respective blueprints
    if path.startswith('api/'):
        return {"error": "API route not found"}, 404
    # Skip asset files - let Flask serve them as static files
    if path.startswith('assets/'):
        return app.send_static_file(path)
    if path == 'favicon.ico':
        return send_from_directory('public', 'favicon.ico')
    # Handle other static files
    if '.' in path and not path.endswith('.html'):
        return app.send_static_file(path)
    return app.send_static_file('index.html')