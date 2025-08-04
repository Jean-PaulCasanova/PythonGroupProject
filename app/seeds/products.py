from app.models import db, Product, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_products():
    # Get users to assign as sellers
    chris = User.query.filter_by(username='chris').first()
    east = User.query.filter_by(username='east').first()
    
    if not chris or not east:
        print("Users not found. Please seed users first.")
        return []
    
    divine_album = Product(
        seller_id=east.id,
        title="Divine Intervention",
        description="A divine album.",
        price=19.99,
        cover_image_url='/blank_cd.png'
    )
    
    cool_gadget = Product(
        seller_id=chris.id,
        title="Cool Gadget",
        description="A really cool gadget.",
        price=29.99,
        cover_image_url='/gadget.png'
    )

    db.session.add_all([divine_album, cool_gadget])
    db.session.commit()
    return [divine_album.id, cool_gadget.id]

def undo_products():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.products RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM products"))
    db.session.commit()