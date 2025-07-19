from app.models import db, Product
from datetime import datetime

def seed_products():
    product1 = Product(
        seller_id=1,
        title="Dreamwave EP",
        description="A smooth, retro-futuristic electronic EP from Neon Ghost.",
        price=9.99,
        cover_image_url="https://via.placeholder.com/300x300.png?text=Dreamwave+EP",
        created_at=datetime.utcnow()
    )

    product2 = Product(
        seller_id=1,
        title="Sunset Lofi Beats",
        description="Chillhop vibes for studying or relaxing.",
        price=5.49,
        cover_image_url="https://via.placeholder.com/300x300.png?text=Sunset+Lofi",
        created_at=datetime.utcnow()
    )

    product3 = Product(
        seller_id=2,
        title="Ambient Oceans",
        description="Soothing ambient textures from a seaborne perspective.",
        price=12.00,
        cover_image_url="https://via.placeholder.com/300x300.png?text=Ambient+Oceans",
        created_at=datetime.utcnow()
    )

    db.session.add_all([product1, product2, product3])
    db.session.commit()


def undo_products():
    db.session.execute("DELETE FROM products")
    db.session.commit()