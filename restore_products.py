from app import app
from app.models import db, Product
with app.app_context():
    db.session.query(Product).filter(Product.id != 1).update({"deleted": False})
    db.session.commit()
