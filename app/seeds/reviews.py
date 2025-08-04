from app.models import db, Review, User
from datetime import datetime
from random import randint, choice
from app.models.db import environment, SCHEMA
from sqlalchemy.sql import text

def seed_reviews(product_ids=None):
    if not product_ids or len(product_ids) < 2:
        print("Product IDs not provided or insufficient. Please seed products first.")
        return
    
    # Get actual user IDs from the database
    users = User.query.all()
    if len(users) < 3:
        print("Not enough users found. Please seed users first.")
        return
    
    user_ids = [user.id for user in users[:3]]
    
    # Use actual user and product IDs
    review1 = Review(
        user_id=user_ids[0],
        product_id=product_ids[0],
        rating=5,
        title="Great product!",
        content="Excellent product! Highly recommend it.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review2 = Review(
        user_id=user_ids[1],
        product_id=product_ids[0],
        rating=4,
        title="Good quality",
        content="Very good quality, but a bit expensive.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review3 = Review(
        user_id=user_ids[2],
        product_id=product_ids[1],
        rating=3,
        title="Average product",
        content="Average product, nothing special.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    db.session.add_all([review1, review2, review3])
    db.session.commit()

def undo_reviews():
    # Check if we're using PostgreSQL (production) or SQLite (development)
    dialect_name = db.engine.dialect.name
    
    if environment == 'production' and dialect_name == 'postgresql':
        # Use PostgreSQL TRUNCATE with schema
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;"))
    else:
        # Use DELETE for SQLite or fallback
        db.session.execute(text("DELETE FROM reviews"))
        try:
            # Reset SQLite sequence if it exists
            db.session.execute(text('DELETE FROM sqlite_sequence WHERE name="reviews"'))
        except Exception:
            # sqlite_sequence may not exist, so just ignore this error
            pass
    db.session.commit()
