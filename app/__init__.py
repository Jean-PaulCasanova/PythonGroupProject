import os
from flask import Flask, request, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import generate_csrf
from flask_login import LoginManager

from .models import db, User
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.product_routes import product_routes
from .api.wishlist_routes import wishlist_routes
from .seeds import seed_commands
from .config import Config

app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')
app.config.from_object(Config)

# Login Manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

# Register seed CLI command
app.cli.add_command(seed_commands)

# Initialize extensions
db.init_app(app)
Migrate(app, db)

# Enable CORS for frontend (localhost:5173 in dev)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# Register active blueprints
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(product_routes, url_prefix='/api/products')
app.register_blueprint(wishlist_routes, url_prefix='/api/wishlist')

# ✅ Optional routes (like reviews) exist in codebase but are not registered here

# HTTPS redirect (only in production, skip OPTIONS preflight)
@app.before_request
def https_redirect():
    if request.method == 'OPTIONS':
        return '', 200
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            return redirect(url, code=301)

# Inject CSRF token after each response
@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=(os.environ.get('FLASK_ENV') == 'production'),
        samesite='Strict' if os.environ.get('FLASK_ENV') == 'production' else None,
        httponly=True
    )
    return response

# API docs helper
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

# React frontend fallback (Vite build)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')

# Handle 404s with React frontend
@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

# CSRF restore route (for dev)
@app.route("/api/csrf/restore", methods=["GET"])
def restore_csrf():
    return {"csrf_token": generate_csrf()}