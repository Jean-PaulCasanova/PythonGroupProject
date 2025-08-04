"""
Improved product_routes.py - Compatible with your database schema
Handles 500 errors with comprehensive error handling and null value protection
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
    from models import Product, db, User
except ImportError:
    try:
        from app.models import Product, db, User
    except ImportError:
        from src.models import Product, db, User

# Create blueprint
product_bp = Blueprint('products', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def safe_serialize_product(product):
    """Safely serialize a product object with your database schema"""
    if not product:
        return None
    
    try:
        return {
            'id': getattr(product, 'id', None),
            'seller_id': getattr(product, 'seller_id', None),
            'title': getattr(product, 'title', None) or '',
            'name': getattr(product, 'title', None) or '',  # Compatibility alias
            'description': getattr(product, 'description', None) or '',
            'price': float(getattr(product, 'price', 0)) if getattr(product, 'price', None) is not None else 0.0,
            'cover_image_url': getattr(product, 'cover_image_url', None),
            'image_url': getattr(product, 'cover_image_url', None),  # Compatibility alias
            'created_at': getattr(product, 'created_at').isoformat() if getattr(product, 'created_at', None) else None,
            'updated_at': getattr(product, 'updated_at').isoformat() if getattr(product, 'updated_at', None) else None
        }
    except Exception as e:
        logger.error(f"Error serializing product {getattr(product, 'id', 'unknown')}: {str(e)}")
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

@product_bp.route('/api/products', methods=['GET'])
@product_bp.route('/api/products/', methods=['GET'])
def get_all_products():
    """Get all products with comprehensive error handling"""
    try:
        logger.info("Fetching all products from database")
        
        # Parse query parameters
        try:
            page = max(1, int(request.args.get('page', 1)))
            per_page = min(100, max(1, int(request.args.get('per_page', 20))))
            search = request.args.get('search', '').strip()
        except (ValueError, TypeError) as e:
            return create_error_response("Invalid query parameters", 400, str(e))
        
        # Build query
        try:
            query = Product.query
            
            if search:
                search_filter = f'%{search}%'
                query = query.filter(
                    db.or_(
                        Product.title.ilike(search_filter),
                        Product.description.ilike(search_filter)
                    )
                )
            
            query = query.order_by(Product.id.asc())
            
        except AttributeError as e:
            return create_error_response("Invalid query parameters", 400)
        
        # Execute query
        try:
            total_count = query.count()
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
            return create_success_response(
                data=[],
                message="No products found",
                meta={'total': 0, 'page': page, 'per_page': per_page, 'total_pages': 0}
            )
        
        # Serialize products
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
        
        # Create response
        meta = {
            'total': total_count,
            'page': page,
            'per_page': per_page,
            'total_pages': (total_count + per_page - 1) // per_page,
            'has_next': paginated_query.has_next,
            'has_prev': paginated_query.has_prev
        }
        
        return create_success_response(
            data=serialized_products,
            message=f"Successfully retrieved {len(serialized_products)} products",
            meta=meta
        )
        
    except Exception as e:
        logger.error(f"Unexpected error in get_all_products: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        return create_error_response("An unexpected error occurred", 500)

@product_bp.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product by ID"""
    try:
        if not isinstance(product_id, int) or product_id <= 0:
            return create_error_response("Invalid product ID", 400)
        
        try:
            product = Product.query.get(product_id)
        except SQLAlchemyError as e:
            return create_error_response("Database query failed", 500)
        
        if not product:
            return create_error_response("Product not found", 404)
        
        serialized_product = safe_serialize_product(product)
        return create_success_response(data=serialized_product, message="Product retrieved successfully")
        
    except Exception as e:
        logger.error(f"Unexpected error in get_product: {str(e)}")
        return create_error_response("An unexpected error occurred", 500)

# Health check endpoints
@product_bp.route('/health', methods=['GET'])
@product_bp.route('/api/products/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        try:
            product_count = Product.query.count()
            db_status = "connected"
        except Exception as e:
            product_count = None
            db_status = "error"
        
        health_info = {
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'database': db_status,
            'product_count': product_count,
            'version': '2.0.0'
        }
        
        return create_success_response(data=health_info, message="API is healthy")
        
    except Exception as e:
        return create_error_response("Health check failed", 500)

@product_bp.route('/api/database/debug', methods=['GET'])
def database_debug():
    """Database debug information"""
    try:
        from sqlalchemy import inspect
        
        debug_info = {
            'timestamp': datetime.utcnow().isoformat(),
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
        return jsonify({'error': str(e), 'timestamp': datetime.utcnow().isoformat()}), 500

@product_bp.route('/api/database/init', methods=['POST'])
def initialize_database():
    """Initialize database tables and sample data"""
    try:
        # Create all tables
        db.create_all()
        
        # Create sample data if tables are empty
        if User.query.count() == 0:
            sample_user = User(
                username='admin',
                email='admin@example.com',
                first_name='Admin',
                last_name='User'
            )
            sample_user.password = 'password123'
            db.session.add(sample_user)
            db.session.commit()
            
        if Product.query.count() == 0:
            sample_products = [
                Product(
                    seller_id=1,
                    title='Sample Album 1',
                    description='A great music album',
                    price=19.99,
                    cover_image_url='https://via.placeholder.com/300x300?text=Album+1'
                ),
                Product(
                    seller_id=1,
                    title='Sample Album 2', 
                    description='Another amazing album',
                    price=24.99,
                    cover_image_url='https://via.placeholder.com/300x300?text=Album+2'
                ),
                Product(
                    seller_id=1,
                    title='Sample Album 3',
                    description='The best album ever',
                    price=29.99,
                    cover_image_url='https://via.placeholder.com/300x300?text=Album+3'
                )
            ]
            
            for product in sample_products:
                db.session.add(product)
            
            db.session.commit()
            
        return create_success_response(
            message="Database initialized successfully",
            data={
                'tables_created': True,
                'sample_data_added': True,
                'user_count': User.query.count(),
                'product_count': Product.query.count()
            }
        )
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Database initialization error: {str(e)}")
        return create_error_response(
            message="Failed to initialize database",
            details=str(e)
        )

# Error handlers
@product_bp.errorhandler(404)
def not_found(error):
    return create_error_response("Endpoint not found", 404)

@product_bp.errorhandler(500)
def internal_error(error):
    return create_error_response("Internal server error", 500)
