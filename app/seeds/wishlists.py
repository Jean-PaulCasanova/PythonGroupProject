from app.models import db, Wishlist, Product, User
from datetime import datetime

def seed_wishlists():
    # Get existing users and products to ensure valid foreign keys
    users = User.query.all()
    products = Product.query.all()
    
    if len(users) < 2 or len(products) < 2:
        print("Not enough users or products to seed wishlists")
        return
    
    # Use actual IDs from the database
    wishlist1 = Wishlist(user_id=users[0].id, product_id=products[0].id)
    wishlist2 = Wishlist(user_id=users[0].id, product_id=products[1].id) if len(products) > 1 else None
    wishlist3 = Wishlist(user_id=users[1].id, product_id=products[1].id) if len(users) > 1 and len(products) > 1 else None

    wishlists = [w for w in [wishlist1, wishlist2, wishlist3] if w is not None]
    db.session.add_all(wishlists)
    db.session.commit()

def undo_wishlists():
    db.session.execute("DELETE FROM wish_list")
    db.session.commit()