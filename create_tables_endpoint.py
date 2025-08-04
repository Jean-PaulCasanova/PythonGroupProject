#!/usr/bin/env python3
"""
Database table creation script for emergency deployment
This creates an endpoint to initialize database tables
"""

from flask import Flask, jsonify
from sqlalchemy import text
import os
import sys

# Add the app directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

try:
    from models import db, User, Product
    from app import create_app
except ImportError:
    try:
        from app.models import db, User, Product
        from app import create_app
    except ImportError:
        print("Could not import models")
        sys.exit(1)

def create_tables():
    """Create all database tables"""
    try:
        # Create all tables
        db.create_all()
        
        # Create sample data
        if User.query.count() == 0:
            sample_user = User(
                username='admin',
                email='admin@example.com',
                first_name='Admin',
                last_name='User'
            )
            sample_user.password = 'password123'  # This should trigger the setter
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
            
        return True, "Tables created and sample data added successfully"
        
    except Exception as e:
        db.session.rollback()
        return False, f"Error creating tables: {str(e)}"

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        success, message = create_tables()
        print(f"Result: {message}")
        if success:
            print("Database initialization completed successfully!")
        else:
            print("Database initialization failed!")
            sys.exit(1)