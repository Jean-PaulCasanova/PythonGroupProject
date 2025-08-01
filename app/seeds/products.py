from app.models import db, Product, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_products():
    # Get users to assign as sellers
    chris = User.query.filter_by(username='chris').first()
    east = User.query.filter_by(username='east').first()
    
    if not chris or not east:
        print("Users not found. Please seed users first.")
        return
    
    # Create sample products with placeholder images
    album1 = Product(
        seller_id=chris.id,
        title="My First Album",
        description="Awesome debut album.",
        price=9.99,
        cover_image_url="https://i.imgur.com/8XAMABv"
    )
    
    test_product1 = Product(
        seller_id=chris.id,
        title="EL Testo",
        description="Test el test testo",
        price=3.50,
        cover_image_url="https://i.imgur.com/8XAMABv"
    )
    
    test_product2 = Product(
        seller_id=chris.id,
        title="Test de gracia",
        description="Testo del Bueno",
        price=2.99,
        cover_image_url="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='14' fill='%23666'%3ETest Product%3C/text%3E%3C/svg%3E"
    )
    
    test_product3 = Product(
        seller_id=chris.id,
        title="Puerto Testo",
        description="Testo del Casi",
        price=3.99,
        cover_image_url="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='14' fill='%23666'%3ETest Product%3C/text%3E%3C/svg%3E"
    )
    
    music_product = Product(
        seller_id=east.id,
        title="nonegen",
        description="gennone",
        price=99.99,
        cover_image_url="https://i.imgur.com/8XAMABv"
    )
    
    generic_product = Product(
        seller_id=east.id,
        title="title",
        description="descri",
        price=9.00,
        cover_image_url="https://i.imgur.com/8XAMABv"
    )
    
    db.session.add_all([album1, test_product1, test_product2, test_product3, music_product, generic_product])
    db.session.commit()

def undo_products():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.products RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM products"))
        
    db.session.commit()