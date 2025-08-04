"""
Updated product_routes.py - Compatible with your database schema
Handles the actual 'products' table structure from your migration
"""

from flask import Blueprint, request, jsonify, current_app
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.orm.exc import NoResultFound
import logging
import traceback
from datetime import datetime
import json

# Import your models - adjust path as needed
try:
    from models import Product, db  # Adjust import path as needed
except ImportError:
    try:
        from app.models import Product, db
    except ImportError:
        from src.models import Product, db

# Create blueprint
product_bp = Blueprint('products', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def safe_serialize_product(product):
    """
    Safely serialize a product object to dictionary
    Compatible with your database schema (id, seller_id, title, description, price, etc.)
    """
    if not product:
        return None
    
    try:
        return {
            'id': getattr(product, 'id', None),
            'seller_id': getattr(product, 'seller_id', None),
            'title': getattr(product, 'title', None) or getattr(product, 'name', None) or '',
            'name': getattr(product, 'title', None) or getattr(product, 'name', None) or '',  # Compatibility
            'description': getattr(product, 'description', None) or '',
            'price': float(getattr(product, 'price', 0)) if getattr(product, 'price', None) is not None else 0.0,
            'cover_image_url': getattr(product, 'cover_image_url', None),
            'image_url': getattr(product, 'cover_image_url', None),  # Compatibility alias
            'created_at': getattr(product, 'created_at').isoformat() if getattr(product, 'created_at', None) else None,
            'updated_at': getattr(product, 'updated_at').isoformat() if getattr(product, 'updated_at', None) else None
        }
    except Exception as e:
        logger.error(f"Error serializing product {getattr(product, 'id', 'unknown')}: {str(e)}")
        # Return minimal safe representation
        return {
            'id': getattr(product, 'id', None),
            'title': str(getattr(product, 'title', 'Unknown Product')),
            'name': str(getattr(product, 'title', 'Unknown Product')),
            'price': 0.0,
            'error': 'Serialization error'
        }

def create_error_response(message, status_code=500, details=None):
    """Create standardized error response"""
    error_response = {
        'success': False,
        'error': message,
        'timestamp': datetime.utcnow().isoformat(),
        'status_code': status_code
    }
    
    if details and current_app.debug:
        error_response['details'] = details
    
    return jsonify(error_response), status_code

def create_success_response(data=None, message="Success", meta=None):
    """Create standardized success response"""
    response = {
        'success': True,
        'message': message,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    if data is not None:
        response['data'] = data
    
    if meta:
        response['meta'] = meta
    
    return jsonify(response), 200

@product_bp.route('/', methods=['GET'])
@product_bp.route('', methods=['GET'])
def get_all_products():
    """
    Get all products with comprehensive error handling
    Compatible with your products table schema
    """
    try:
        logger.info("Fetching all products from database")
        
        # Parse query parameters with defaults and validation
        try:
            page = max(1, int(request.args.get('page', 1)))
            per_page = min(100, max(1, int(request.args.get('per_page', 20))))
            search = request.args.get('search', '').strip()
            sort_by = request.args.get('sort_by', 'id').strip()
            sort_order = request.args.get('sort_order', 'asc').strip().lower()
        except (ValueError, TypeError) as e:
            logger.warning(f"Invalid query parameters: {str(e)}")
            return create_error_response("Invalid query parameters", 400, str(e))
        
        # Validate sort parameters
        valid_sort_fields = ['id', 'title', 'price', 'created_at', 'updated_at']
        if sort_by not in valid_sort_fields:
            sort_by = 'id'
        
        if sort_order not in ['asc', 'desc']:
            sort_order = 'asc'
        
        # Build query with error handling
        try:
            query = Product.query
            
            # Apply search filter if provided
            if search:
                search_filter = f'%{search}%'
                query = query.filter(
                    db.or_(
                        Product.title.ilike(search_filter),
                        Product.description.ilike(search_filter)
                    )
                )
            
            # Apply sorting
            sort_column = getattr(Product, sort_by, Product.id)
            if sort_order == 'desc':
                query = query.order_by(sort_column.desc())
            else:
                query = query.order_by(sort_column.asc())
            
        except AttributeError as e:
            logger.error(f"Invalid filter or sort attribute: {str(e)}")
            return create_error_response("Invalid filter or sort parameter", 400)
        
        # Execute query with pagination
        try:
            # Get total count for pagination metadata
            total_count = query.count()
            
            # Apply pagination
            paginated_query = query.paginate(
                page=page,
                per_page=per_page,
                error_out=False,
                max_per_page=100
            )
            
            products = paginated_query.items
            
        except SQLAlchemyError as e:
            logger.error(f"Database query error: {str(e)}")
            return create_error_response("Database query failed", 500, str(e))
        
        # Handle empty results
        if not products:
            logger.info("No products found")
            return create_success_response(
                data=[],
                message="No products found",
                meta={
                    'total': 0,
                    'page': page,
                    'per_page': per_page,
                    'total_pages': 0
                }
            )
        
        # Serialize products safely
        try:
            serialized_products = []
            for product in products:
                try:
                    serialized_product = safe_serialize_product(product)
                    if serialized_product:
                        serialized_products.append(serialized_product)
                except Exception as e:
                    logger.warning(f"Failed to serialize product {getattr(product, 'id', 'unknown')}: {str(e)}")
                    continue
            
        except Exception as e:
            logger.error(f"Error during product serialization: {str(e)}")
            return create_error_response("Failed to process product data", 500)
        
        # Create pagination metadata
        meta = {
            'total': total_count,
            'page': page,
            'per_page': per_page,
            'total_pages': (total_count + per_page - 1) // per_page,
            'has_next': paginated_query.has_next,
            'has_prev': paginated_query.has_prev,
            'next_page': paginated_query.next_num if paginated_query.has_next else None,
            'prev_page': paginated_query.prev_num if paginated_query.has_prev else None
        }
        
        logger.info(f"Successfully fetched {len(serialized_products)} products")
        
        return create_success_response(
            data=serialized_products,
            message=f"Successfully retrieved {len(serialized_products)} products",
            meta=meta
        )
        
    except NoResultFound:
        logger.info("No products found in database")
        return create_success_response(
            data=[],
            message="No products found"
        )
        
    except SQLAlchemyError as e:
        logger.error(f"Database connection error: {str(e)}")
        return create_error_response(
            "Database connection failed", 
            500, 
            str(e) if current_app.debug else None
        )
        
    except Exception as e:
        logger.error(f"Unexpected error in get_all_products: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        return create_error_response(
            "An unexpected error occurred while fetching products",
            500,
            str(e) if current_app.debug else None
        )

@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a single product by ID with error handling"""
    try:
        if not isinstance(product_id, int) or product_id <= 0:
            return create_error_response("Invalid product ID", 400)
        
        logger.info(f"Fetching product with ID: {product_id}")
        
        try:
            product = Product.query.get(product_id)
        except SQLAlchemyError as e:
            logger.error(f"Database error fetching product {product_id}: {str(e)}")
            return create_error_response("Database query failed", 500)
        
        if not product:
            logger.info(f"Product {product_id} not found")
            return create_error_response("Product not found", 404)
        
        try:
            serialized_product = safe_serialize_product(product)
            if not serialized_product:
                return create_error_response("Failed to process product data", 500)
            
        except Exception as e:
            logger.error(f"Error serializing product {product_id}: {str(e)}")
            return create_error_response("Failed to process product data", 500)
        
        logger.info(f"Successfully fetched product {product_id}")
        return create_success_response(
            data=serialized_product,
            message="Product retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Unexpected error in get_product: {str(e)}")
        return create_error_response("An unexpected error occurred", 500)

@product_bp.route('/', methods=['POST'])
def create_product():
    """Create a new product with validation for your schema"""
    try:
        try:
            data = request.get_json()
            if not data:
                return create_error_response("No data provided", 400)
        except Exception as e:
            logger.error(f"Error parsing JSON data: {str(e)}")
            return create_error_response("Invalid JSON data", 400)
        
        # Validate required fields for your schema
        required_fields = ['title', 'description', 'price', 'seller_id']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return create_error_response(
                f"Missing required fields: {', '.join(missing_fields)}", 
                400
            )
        
        # Validate data types and values
        try:
            price = float(data.get('price', 0))
            if price < 0:
                return create_error_response("Price cannot be negative", 400)
            
            seller_id = int(data.get('seller_id'))
            if seller_id <= 0:
                return create_error_response("Invalid seller ID", 400)
            
            title = str(data.get('title', '')).strip()
            if len(title) < 1:
                return create_error_response("Product title cannot be empty", 400)
            if len(title) > 100:
                return create_error_response("Product title too long (max 100 characters)", 400)
            
            description = str(data.get('description', '')).strip()
            if len(description) < 1:
                return create_error_response("Product description cannot be empty", 400)
            
        except (ValueError, TypeError) as e:
            logger.error(f"Data validation error: {str(e)}")
            return create_error_response("Invalid data format", 400)
        
        # Create product object
        try:
            product = Product(
                seller_id=seller_id,
                title=title,
                description=description,
                price=price,
                cover_image_url=str(data.get('cover_image_url', '')).strip() or None,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
        except Exception as e:
            logger.error(f"Error creating product object: {str(e)}")
            return create_error_response("Failed to create product", 500)
        
        # Save to database
        try:
            db.session.add(product)
            db.session.commit()
            
            logger.info(f"Successfully created product: {product.id}")
            
            serialized_product = safe_serialize_product(product)
            return create_success_response(
                data=serialized_product,
                message="Product created successfully"
            )
            
        except IntegrityError as e:
            db.session.rollback()
            logger.error(f"Database integrity error: {str(e)}")
            return create_error_response("Product creation failed - constraint violation", 409)
            
        except SQLAlchemyError as e:
            db.session.rollback()
            logger.error(f"Database error creating product: {str(e)}")
            return create_error_response("Failed to save product to database", 500)
        
    except Exception as e:
        logger.error(f"Unexpected error in create_product: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        return create_error_response("An unexpected error occurred", 500)

# Health check and debug endpoints
@product_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        try:
            product_count = Product.query.count()
            db_status = "connected"
        except Exception as e:
            logger.error(f"Database health check failed: {str(e)}")
            product_count = None
            db_status = "error"
        
        health_info = {
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'database': db_status,
            'product_count': product_count,
            'version': '1.0.0'
        }
        
        return create_success_response(
            data=health_info,
            message="Products API is healthy"
        )
        
    except Exception as e:
        logger.error(f"Health check error: {str(e)}")
        return create_error_response("Health check failed", 500)

@product_bp.route('/database/debug', methods=['GET'])
def database_debug():
    """Database debug endpoint"""
    try:
        from sqlalchemy import inspect
        
        debug_info = {
            'timestamp': datetime.utcnow().isoformat(),
            'database_url': current_app.config.get('SQLALCHEMY_DATABASE_URI', 'Not configured')[:50] + '...',
            'tables': [],
            'table_exists': False,
            'product_count': 0
        }
        
        try:
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            debug_info['tables'] = tables
            debug_info['table_exists'] = 'products' in tables
            
            if debug_info['table_exists']:
                debug_info['product_count'] = Product.query.count()
            
        except Exception as e:
            debug_info['error'] = str(e)
        
        return jsonify(debug_info)
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

# Error handlers
@product_bp.errorhandler(404)
def not_found(error):
    return create_error_response("Endpoint not found", 404)

@product_bp.errorhandler(405)
def method_not_allowed(error):
    return create_error_response("Method not allowed", 405)

@product_bp.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {str(error)}")
    return create_error_response("Internal server error", 500)

# Export the blueprint with the expected name for compatibility
product_routes = product_bp
