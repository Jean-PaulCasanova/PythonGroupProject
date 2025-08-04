from app.models import db, Review
from datetime import datetime
from random import randint, choice
from app.models.db import environment

def seed_reviews(product_ids=None):
    if not product_ids or len(product_ids) < 2:
        print("Product IDs not provided or insufficient. Please seed products first.")
        return
    # Use actual product IDs
    review1 = Review(
        user_id=1,
        product_id=product_ids[0],
        rating=5,
        title="Great product!",
        content="Excellent product! Highly recommend it.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review2 = Review(
        user_id=2,
        product_id=product_ids[0],
        rating=4,
        title="Good quality",
        content="Very good quality, but a bit expensive.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review3 = Review(
        user_id=3,
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
    if environment == 'production':
        db.session.execute('TRUNCATE TABLE reviews RESTART IDENTITY CASCADE;')
    else:
        db.session.execute('DELETE FROM reviews')
        try:
            db.session.execute('DELETE FROM sqlite_sequence WHERE name="reviews"')
        except Exception:
            # sqlite_sequence may not exist, so just ignore this error
            pass
    db.session.commit()
