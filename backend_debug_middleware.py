# Universal Backend Debug Middleware
# Works with Django, Flask, FastAPI, and can be adapted for Rails/Express

import json
import time
import traceback
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class ProductDebugMiddleware:
    """Universal debugging middleware for product creation endpoints"""
    
    def __init__(self, app=None, debug_mode=True):
        self.app = app
        self.debug_mode = debug_mode
        self.request_log = []
        
    def log_debug(self, message, data=None):
        if self.debug_mode:
            timestamp = datetime.now().isoformat()
            log_entry = {
                'timestamp': timestamp,
                'message': message,
                'data': data
            }
            self.request_log.append(log_entry)
            logger.debug(f"[PRODUCT_DEBUG] {message}: {data}")
    
    def analyze_request(self, request):
        """Analyze incoming request for debugging"""
        analysis = {
            'method': getattr(request, 'method', 'Unknown'),
            'path': getattr(request, 'path', 'Unknown'),
            'content_type': getattr(request, 'content_type', 'Unknown'),
            'headers': dict(getattr(request, 'headers', {})),
            'user_authenticated': hasattr(request, 'user') and getattr(request.user, 'is_authenticated', False),
        }
        
        # Get form data
        if hasattr(request, 'POST') and request.POST:
            analysis['form_data'] = dict(request.POST)
        elif hasattr(request, 'form') and request.form:
            analysis['form_data'] = dict(request.form)
        elif hasattr(request, 'json') and request.json:
            analysis['json_data'] = request.json
            
        # Get files
        if hasattr(request, 'FILES') and request.FILES:
            analysis['files'] = list(request.FILES.keys())
        elif hasattr(request, 'files') and request.files:
            analysis['files'] = list(request.files.keys())
            
        self.log_debug("Request Analysis", analysis)
        return analysis
    
    def validate_product_data(self, data):
        """Validate product data and provide detailed feedback"""
        errors = []
        warnings = []
        
        required_fields = ['name', 'price']
        optional_fields = ['description', 'category', 'sku', 'quantity']
        
        # Check required fields
        for field in required_fields:
            if field not in data or not data[field]:
                errors.append(f"Missing required field: {field}")
        
        # Validate data types and formats
        if 'price' in data:
            try:
                price = float(data['price'])
                if price < 0:
                    errors.append("Price cannot be negative")
            except (ValueError, TypeError):
                errors.append("Price must be a valid number")
        
        if 'quantity' in data:
            try:
                quantity = int(data['quantity'])
                if quantity < 0:
                    warnings.append("Quantity is negative")
            except (ValueError, TypeError):
                errors.append("Quantity must be a valid integer")
        
        # Check for suspicious data
        if 'name' in data and len(data['name']) > 255:
            warnings.append("Product name is very long")
            
        validation_result = {
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }
        
        self.log_debug("Product Data Validation", validation_result)
        return validation_result
    
    def debug_database_operation(self, operation, model_class=None, data=None):
        """Debug database operations"""
        try:
            self.log_debug(f"Database Operation: {operation}", {
                'model': str(model_class) if model_class else 'Unknown',
                'data': data
            })
            
            # Test database connection
            if hasattr(model_class, 'objects'):
                # Django ORM
                try:
                    count = model_class.objects.count()
                    self.log_debug("Database Connection", f"Existing records: {count}")
                except Exception as e:
                    self.log_debug("Database Error", str(e))
            
        except Exception as e:
            self.log_debug("Database Debug Error", str(e))
    
    def create_debug_response(self, success=False, message="", data=None, errors=None):
        """Create standardized debug response"""
        response_data = {
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'debug_info': {
                'request_log': self.request_log[-10:],  # Last 10 entries
                'data': data,
                'errors': errors or []
            }
        }
        
        if not success:
            response_data['debug_help'] = {
                'common_issues': [
                    'Check CSRF token is present and valid',
                    'Verify all required fields are filled',
                    'Ensure user has proper permissions',
                    'Check database connection',
                    'Verify model validations'
                ],
                'troubleshooting_steps': [
                    'Check browser console for JavaScript errors',
                    'Verify form data is being sent correctly',
                    'Check server logs for detailed error messages',
                    'Test with minimal required data first'
                ]
            }
        
        return response_data

# Django Implementation
class DjangoProductDebugMiddleware(ProductDebugMiddleware):
    def __init__(self, get_response):
        self.get_response = get_response
        super().__init__(debug_mode=True)
    
    def __call__(self, request):
        if '/products' in request.path and request.method == 'POST':
            self.log_debug("Django Product Creation Request Intercepted")
            self.analyze_request(request)
            
            # Extract product data
            product_data = dict(request.POST)
            validation = self.validate_product_data(product_data)
            
            if not validation['valid']:
                self.log_debug("Validation Failed", validation)
                from django.http import JsonResponse
                return JsonResponse(self.create_debug_response(
                    success=False,
                    message="Validation errors found",
                    errors=validation['errors']
                ))
        
        response = self.get_response(request)
        
        if '/products' in request.path and request.method == 'POST':
            self.log_debug("Response Status", response.status_code)
        
        return response

# Flask Implementation
class FlaskProductDebugMiddleware(ProductDebugMiddleware):
    def __init__(self, app):
        super().__init__(app, debug_mode=True)
        self.init_app(app)
    
    def init_app(self, app):
        @app.before_request
        def before_request():
            from flask import request, g
            if '/products' in request.path and request.method == 'POST':
                self.log_debug("Flask Product Creation Request Intercepted")
                analysis = self.analyze_request(request)
                g.debug_analysis = analysis
                
                # Get form data
                product_data = dict(request.form) if request.form else request.get_json() or {}
                validation = self.validate_product_data(product_data)
                g.debug_validation = validation
                
                if not validation['valid']:
                    from flask import jsonify
                    return jsonify(self.create_debug_response(
                        success=False,
                        message="Validation errors found",
                        errors=validation['errors']
                    )), 400
        
        @app.after_request
        def after_request(response):
            from flask import request, g
            if '/products' in request.path and request.method == 'POST':
                self.log_debug("Flask Response Status", response.status_code)
                
                # Add debug headers
                if hasattr(g, 'debug_analysis'):
                    response.headers['X-Debug-Analysis'] = 'Check logs'
            
            return response

# FastAPI Implementation
def create_fastapi_debug_middleware():
    from fastapi import Request, HTTPException
    from fastapi.responses import JSONResponse
    import asyncio
    
    middleware = ProductDebugMiddleware(debug_mode=True)
    
    async def debug_middleware(request: Request, call_next):
        if '/products' in str(request.url.path) and request.method == 'POST':
            middleware.log_debug("FastAPI Product Creation Request Intercepted")
            
            # Analyze request
            analysis = {
                'method': request.method,
                'path': str(request.url.path),
                'headers': dict(request.headers),
                'query_params': dict(request.query_params)
            }
            
            # Get body data
            try:
                body = await request.body()
                if body:
                    import json
                    try:
                        json_data = json.loads(body)
                        analysis['json_data'] = json_data
                        validation = middleware.validate_product_data(json_data)
                        
                        if not validation['valid']:
                            return JSONResponse(
                                content=middleware.create_debug_response(
                                    success=False,
                                    message="Validation errors found",
                                    errors=validation['errors']
                                ),
                                status_code=400
                            )
                    except json.JSONDecodeError:
                        analysis['form_data'] = body.decode()
            except Exception as e:
                middleware.log_debug("Error reading request body", str(e))
            
            middleware.log_debug("FastAPI Request Analysis", analysis)
        
        response = await call_next(request)
        
        if '/products' in str(request.url.path) and request.method == 'POST':
            middleware.log_debug("FastAPI Response Status", response.status_code)
        
        return response
    
    return debug_middleware

# Rails equivalent (Ruby code for reference)
RAILS_DEBUG_CODE = '''
# Rails Debug Middleware - Add to config/application.rb or as a Rack middleware

class ProductDebugMiddleware
  def initialize(app)
    @app = app
  end

  def call(env)
    request = Rack::Request.new(env)
    
    if request.path.include?('/products') && request.post?
      Rails.logger.debug "[PRODUCT_DEBUG] Request intercepted: #{request.path}"
      Rails.logger.debug "[PRODUCT_DEBUG] Headers: #{request.env.select {|k,v| k.start_with? 'HTTP_'}}"
      Rails.logger.debug "[PRODUCT_DEBUG] Params: #{request.params}"
      
      # Validate parameters
      required_params = ['name', 'price']
      missing_params = required_params.select { |param| request.params[param].blank? }
      
      if missing_params.any?
        Rails.logger.error "[PRODUCT_DEBUG] Missing required parameters: #{missing_params}"
        return [400, {'Content-Type' => 'application/json'}, 
                [{ error: "Missing required parameters: #{missing_params.join(', ')}" }.to_json]]
      end
    end
    
    status, headers, body = @app.call(env)
    
    if request.path.include?('/products') && request.post?
      Rails.logger.debug "[PRODUCT_DEBUG] Response status: #{status}"
    end
    
    [status, headers, body]
  end
end

# Add to config/application.rb:
# config.middleware.insert_before 0, ProductDebugMiddleware
'''

# Usage examples
USAGE_EXAMPLES = '''
# Django - Add to settings.py MIDDLEWARE:
MIDDLEWARE = [
    'path.to.middleware.DjangoProductDebugMiddleware',
    # ... other middleware
]

# Flask - In your app factory:
from flask import Flask
app = Flask(__name__)
FlaskProductDebugMiddleware(app)

# FastAPI - Add middleware:
from fastapi import FastAPI
app = FastAPI()
app.middleware("http")(create_fastapi_debug_middleware())
'''

if __name__ == "__main__":
    # Test the validation function
    middleware = ProductDebugMiddleware()
    
    test_data = {
        'name': 'Test Product',
        'price': '99.99',
        'description': 'A test product',
        'quantity': '10'
    }
    
    result = middleware.validate_product_data(test_data)
    print("Validation Result:", json.dumps(result, indent=2))
