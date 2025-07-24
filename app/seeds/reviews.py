from app.models import db, Review
from datetime import datetime
from random import randint, choice

def seed_reviews():
    review1 = Review(
        user_id=1,
        product_id=1,
        rating=5,
        comment="Excellent product! Highly recommend it.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review2 = Review(
        user_id=2,
        product_id=1,
        rating=4,
        comment="Very good quality, but a bit expensive.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review3 = Review(
        user_id=3,
        product_id=2,
        rating=3,
        comment="Average product, nothing special.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    db.session.add_all([review1, review2, review3])
    db.session.commit()

def undo_reviews():
    db.session.execute('TRUNCATE TABLE reviews RESTART IDENTITY CASCADE;')
    db.session.commit()