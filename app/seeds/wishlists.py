from app.models import db, Wishlist
from datetime import datetime

def seed_wishlists():
    wishlist1 = Wishlist(user_id=1, product_id=1)
    wishlist2 = Wishlist(user_id=1, product_id=2)
    wishlist3 = Wishlist(user_id=2, product_id=2)

    db.session.add_all([wishlist1, wishlist2, wishlist3])
    db.session.commit()

def undo_wishlists():
    db.session.execute("DELETE FROM wish_list")
    db.session.commit()