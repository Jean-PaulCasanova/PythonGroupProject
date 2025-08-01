# import os
# from flask import Flask, render_template, request, session, redirect
# from flask_cors import CORS
# from flask_migrate import Migrate
# from flask_wtf.csrf import CSRFProtect, generate_csrf
# from flask_login import LoginManager
# from .models import db, User
# from .api.user_routes import user_routes
# from .api.auth_routes import auth_routes
# from .api.product_routes import product_routes
# from .seeds import seed_commands
# from .config import Config

# app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/static')

# # Setup login manager
# login = LoginManager(app)
# login.login_view = 'auth.unauthorized'


# @login.user_loader
# def load_user(id):
#     return User.query.get(int(id))


# # Tell flask about our seed commands
# app.cli.add_command(seed_commands)

# app.config.from_object(Config)
# app.register_blueprint(user_routes, url_prefix='/api/users')
# app.register_blueprint(auth_routes, url_prefix='/api/auth')
# app.register_blueprint(product_routes)
# db.init_app(app)
# Migrate(app, db)

# # Application Security
# CORS(app)


# # Since we are deploying with Docker and Flask,
# # we won't be using a buildpack when we deploy to Heroku.
# # Therefore, we need to make sure that in production any
# # request made over http is redirected to https.
# # Well.........
# @app.before_request
# def https_redirect():
#     if os.environ.get('FLASK_ENV') == 'production':
#         if request.headers.get('X-Forwarded-Proto') == 'http':
#             url = request.url.replace('http://', 'https://', 1)
#             code = 301
#             return redirect(url, code=code)


# @app.after_request
# def inject_csrf_token(response):
#     response.set_cookie(
#         'csrf_token',
#         generate_csrf(),
#         secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
#         samesite='Strict' if os.environ.get(
#             'FLASK_ENV') == 'production' else None,
#         httponly=True)
#     return response


# @app.route("/api/docs")
# def api_help():
#     """
#     Returns all API routes and their doc strings
#     """
#     acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
#     route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
#                     app.view_functions[rule.endpoint].__doc__ ]
#                     for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
#     return route_list


# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def react_root(path):
#     """
#     This route will direct to the public directory in our
#     react builds in the production environment for favicon
#     or index.html requests
#     """
#     if path == 'favicon.ico':
#         return app.send_from_directory('public', 'favicon.ico')
#     return app.send_static_file('index.html')


# @app.errorhandler(404)
# def not_found(e):
#     return app.send_static_file('index.html')

# import os
# from flask import Flask, render_template, request, session, redirect
# from flask_cors import CORS
# from flask_migrate import Migrate
# from flask_wtf.csrf import CSRFProtect, generate_csrf
# from flask_login import LoginManager
# from .models import db, User
# from .api.user_routes import user_routes
# from .api.auth_routes import auth_routes
# from .api.product_routes import product_routes
# from .seeds import seed_commands
# from .config import Config

# app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')

# # Setup login manager
# login = LoginManager(app)
# login.login_view = 'auth.unauthorized'


# @login.user_loader
# def load_user(id):
#     return User.query.get(int(id))


# # Tell flask about our seed commands
# app.cli.add_command(seed_commands)

# app.config.from_object(Config)
# app.register_blueprint(user_routes, url_prefix='/api/users')
# app.register_blueprint(auth_routes, url_prefix='/api/auth')
# app.register_blueprint(product_routes)
# db.init_app(app)
# Migrate(app, db)

# # Application Security
# CORS(app)


# # Since we are deploying with Docker and Flask,
# # we won't be using a buildpack when we deploy to Heroku.
# # Therefore, we need to make sure that in production any
# # request made over http is redirected to https.
# # Well.........
# @app.before_request
# def https_redirect():
#     if os.environ.get('FLASK_ENV') == 'production':
#         # Don't redirect CORS preflight (OPTIONS) requests
#         if request.method == 'OPTIONS':
#             return
#         if request.headers.get('X-Forwarded-Proto') == 'http':
#             url = request.url.replace('http://', 'https://', 1)
#             code = 301
#             return redirect(url, code=code)


# @app.after_request
# def inject_csrf_token(response):
#     response.set_cookie(
#         'csrf_token',
#         generate_csrf(),
#         secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
#         samesite='Strict' if os.environ.get(
#             'FLASK_ENV') == 'production' else None,
#         httponly=True)
#     return response


# @app.route("/api/docs")
# def api_help():
#     """
#     Returns all API routes and their doc strings
#     """
#     acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
#     route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
#                     app.view_functions[rule.endpoint].__doc__ ]
#                     for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
#     return route_list


# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def react_root(path):
#     """
#     This route will direct to the public directory in our
#     react builds in the production environment for favicon
#     or index.html requests
#     """
#     if path == 'favicon.ico':
#         return app.send_from_directory('public', 'favicon.ico')
#     return app.send_static_file('index.html')


# @app.errorhandler(404)
# def not_found(e):
#     return app.send_static_file('index.html')




# import os
# from flask import Flask, render_template, request, session, redirect
# from flask_cors import CORS
# from flask_migrate import Migrate
# from flask_wtf.csrf import CSRFProtect, generate_csrf
# from flask_login import LoginManager
# from .models import db, User
# from .api.user_routes import user_routes
# from .api.auth_routes import auth_routes
# from .api.product_routes import product_routes
# from .seeds import seed_commands
# from .config import Config

# app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')

# # Setup login manager
# login = LoginManager(app)
# login.login_view = 'auth.unauthorized'

# @login.user_loader
# def load_user(id):
#     return User.query.get(int(id))

# # Tell flask about our seed commands
# app.cli.add_command(seed_commands)

# app.config.from_object(Config)
# app.register_blueprint(user_routes, url_prefix='/api/users')
# app.register_blueprint(auth_routes, url_prefix='/api/auth')
# app.register_blueprint(product_routes)
# db.init_app(app)
# Migrate(app, db)


# # Allow cross-origin requests with credentials from your frontend
# CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# # Since we are deploying with Docker and Flask,
# # we won't be using a buildpack when we deploy to Heroku.
# # Therefore, we need to make sure that in production any
# # request made over http is redirected to https.
# # Well.........
# @app.before_request
# def https_redirect():
#     if os.environ.get('FLASK_ENV') == 'production':
#         # Don't redirect CORS preflight (OPTIONS) requests
#         if request.method == 'OPTIONS':
#             return
#         if request.headers.get('X-Forwarded-Proto') == 'http':
#             url = request.url.replace('http://', 'https://', 1)
#             code = 301
#             return redirect(url, code=code)

# @app.after_request
# def inject_csrf_token(response):
#     response.set_cookie(
#         'csrf_token',
#         generate_csrf(),
#         secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
#         samesite='Strict' if os.environ.get('FLASK_ENV') == 'production' else None,
#         httponly=True)
#     return response

# @app.route("/api/docs")
# def api_help():
#     """
#     Returns all API routes and their doc strings
#     """
#     acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
#     route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
#                     app.view_functions[rule.endpoint].__doc__ ]
#                     for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
#     return route_list

# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def react_root(path):
#     """
#     This route will direct to the public directory in our
#     react builds in the production environment for favicon
#     or index.html requests
#     """
#     if path == 'favicon.ico':
#         return app.send_from_directory('public', 'favicon.ico')
#     return app.send_static_file('index.html')

# @app.errorhandler(404)
# def not_found(e):
#     return app.send_static_file('index.html')

# import os
# from flask import Flask, render_template, request, session, redirect
# from flask_cors import CORS
# from flask_migrate import Migrate
# from flask_wtf.csrf import CSRFProtect, generate_csrf
# from flask_login import LoginManager
# from .models import db, User
# from .api.user_routes import user_routes
# from .api.auth_routes import auth_routes
# from .api.product_routes import product_routes
# from .seeds import seed_commands
# from .config import Config

# app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')

# # Setup login manager
# login = LoginManager(app)
# login.login_view = 'auth.unauthorized'

# @login.user_loader
# def load_user(id):
#     return User.query.get(int(id))

# # Add CLI seed command
# app.cli.add_command(seed_commands)

# # Load app configuration
# app.config.from_object(Config)

# # Register blueprints
# app.register_blueprint(user_routes, url_prefix='/api/users')
# app.register_blueprint(auth_routes, url_prefix='/api/auth')
# app.register_blueprint(product_routes, url_prefix='/api/products')

# # Initialize database and migration
# db.init_app(app)
# Migrate(app, db)

# # Enable CORS for frontend origin, support credentials
# # 👇 This is required for fetch cookies to work across localhost ports
# CORS(app, supports_credentials=True, origins=["http://localhost:5173"])


# def https_redirect():
#     if request.method == 'OPTIONS':
#         return  # 🔥 This prevents redirect during preflight which causes your error
#     if os.environ.get('FLASK_ENV') == 'production':
#         if request.headers.get('X-Forwarded-Proto') == 'http':
#             url = request.url.replace('http://', 'https://', 1)
#             return redirect(url, code=301)

# # CSRF token injection into cookies
# @app.after_request
# def inject_csrf_token(response):
#     response.set_cookie(
#         'csrf_token',
#         generate_csrf(),
#         secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
#         samesite='Strict' if os.environ.get('FLASK_ENV') == 'production' else None,
#         httponly=True
#     )
#     return response

# # API documentation route
# @app.route("/api/docs")
# def api_help():
#     """
#     Returns all API routes and their doc strings
#     """
#     acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
#     route_list = {
#         rule.rule: [
#             [method for method in rule.methods if method in acceptable_methods],
#             app.view_functions[rule.endpoint].__doc__
#         ]
#         for rule in app.url_map.iter_rules() if rule.endpoint != 'static'
#     }
#     return route_list

# # React frontend catch-all route
# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def react_root(path):
#     """
#     Serves the React frontend build
#     """
#     if path == 'favicon.ico':
#         return app.send_from_directory('public', 'favicon.ico')
#     return app.send_static_file('index.html')

# # Handle 404s with React app
# @app.errorhandler(404)
# def not_found(e):
#     return app.send_static_file('index.html')



import os
from flask import Flask, render_template, request, session, redirect
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
from .seeds import seed_commands
from .config import Config

app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/static')

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

# Initialize database and migration
db.init_app(app)
Migrate(app, db)

# Enable CORS for frontend origin, support credentials
# Allow all origins in production, localhost in development
if os.environ.get('FLASK_ENV') == 'production':
    CORS(app, supports_credentials=True)
else:
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

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

# Handle 404s with React app
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
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')