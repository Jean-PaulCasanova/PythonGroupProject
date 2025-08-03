from flask import Blueprint, request, jsonify, session
from flask_wtf.csrf import generate_csrf, validate_csrf
from flask_login import current_user
import os

csrf_debug = Blueprint('csrf_debug', __name__)

@csrf_debug.route('/api/csrf/debug', methods=['GET'])
def csrf_debug_info():
    """
    Debug endpoint to check CSRF token status and configuration
    Useful for troubleshooting CSRF issues in Docker and Render.com deployments
    """
    try:
        # Generate a fresh CSRF token
        csrf_token = generate_csrf()
        
        # Get current session info
        session_data = {
            'session_id': session.get('_id', 'No session ID'),
            'csrf_token_in_session': session.get('csrf_token', 'No CSRF token in session'),
            'user_authenticated': current_user.is_authenticated if current_user else False,
            'user_id': current_user.id if current_user and current_user.is_authenticated else None
        }
        
        # Get request headers
        csrf_headers = {
            'X-CSRFToken': request.headers.get('X-CSRFToken', 'Not present'),
            'X-CSRF-Token': request.headers.get('X-CSRF-Token', 'Not present'),
            'XSRF-Token': request.headers.get('XSRF-Token', 'Not present')
        }
        
        # Get cookies
        csrf_cookies = {
            'csrf_token': request.cookies.get('csrf_token', 'Not present'),
            'XSRF-TOKEN': request.cookies.get('XSRF-TOKEN', 'Not present'),
            '_csrf': request.cookies.get('_csrf', 'Not present')
        }
        
        # Environment info
        env_info = {
            'FLASK_ENV': os.environ.get('FLASK_ENV', 'Not set'),
            'SECRET_KEY_SET': 'Yes' if os.environ.get('SECRET_KEY') else 'No',
            'WTF_CSRF_ENABLED': os.environ.get('WTF_CSRF_ENABLED', 'Default (True)'),
            'WTF_CSRF_TIME_LIMIT': os.environ.get('WTF_CSRF_TIME_LIMIT', 'Default (3600)')
        }
        
        return jsonify({
            'status': 'success',
            'message': 'CSRF Debug Information',
            'csrf_token': csrf_token,
            'session': session_data,
            'headers': csrf_headers,
            'cookies': csrf_cookies,
            'environment': env_info,
            'request_method': request.method,
            'request_origin': request.headers.get('Origin', 'Not present'),
            'request_referer': request.headers.get('Referer', 'Not present')
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'CSRF Debug Error: {str(e)}'
        }), 500

@csrf_debug.route('/api/csrf/validate', methods=['POST'])
def csrf_validate_token():
    """
    Endpoint to validate a CSRF token
    Useful for testing CSRF token validation
    """
    try:
        # Get token from various sources
        token_from_header = request.headers.get('X-CSRFToken')
        token_from_form = request.form.get('csrf_token')
        token_from_json = request.get_json().get('csrf_token') if request.is_json else None
        
        token_to_validate = token_from_header or token_from_form or token_from_json
        
        if not token_to_validate:
            return jsonify({
                'status': 'error',
                'message': 'No CSRF token provided',
                'valid': False
            }), 400
        
        # Validate the token
        try:
            validate_csrf(token_to_validate)
            is_valid = True
            validation_message = 'CSRF token is valid'
        except Exception as validation_error:
            is_valid = False
            validation_message = f'CSRF token validation failed: {str(validation_error)}'
        
        return jsonify({
            'status': 'success',
            'message': validation_message,
            'valid': is_valid,
            'token_source': 'header' if token_from_header else 'form' if token_from_form else 'json',
            'token_provided': token_to_validate[:10] + '...' if len(token_to_validate) > 10 else token_to_validate
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'CSRF Validation Error: {str(e)}',
            'valid': False
        }), 500

@csrf_debug.route('/api/csrf/test-endpoint', methods=['POST'])
def csrf_test_endpoint():
    """
    Test endpoint that requires CSRF protection
    Useful for testing CSRF functionality end-to-end
    """
    try:
        data = request.get_json() if request.is_json else request.form.to_dict()
        
        return jsonify({
            'status': 'success',
            'message': 'CSRF test endpoint reached successfully',
            'data_received': data,
            'user_authenticated': current_user.is_authenticated if current_user else False,
            'csrf_protection': 'Working correctly'
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'CSRF Test Error: {str(e)}'
        }), 500