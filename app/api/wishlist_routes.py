from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Wishlist, Product

wishlist_routes = Blueprint("wishlist", __name__)

# GET /api/wishlist — Return all products in current user's wishlist
@wishlist_routes.route("/", methods=["GET"])
#@login_required
def get_wishlist():
    wishlist_items = Wishlist.query.filter_by(user_id=2).all() #id hardcoded
    return jsonify([
        {
            "id": item.id,
            "productId": item.product_id,
            "title": item.product.title,
            "coverImageUrl": item.product.cover_image_url,
            "price": str(item.product.price),
        } for item in wishlist_items
    ])

# POST /api/wishlist/<int:product_id> — Add to wishlist
@wishlist_routes.route("/<int:product_id>", methods=["POST"])
@login_required
def add_to_wishlist(product_id):
    existing = Wishlist.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    if existing:
        return jsonify({"error": "Product is already in wishlist"}), 400

    wishlist_item = Wishlist(user_id=current_user.id, product_id=product_id)
    db.session.add(wishlist_item)
    db.session.commit()

    return jsonify({
        "message": "Product added to wishlist",
        "id": wishlist_item.id
    }), 201

# DELETE /api/wishlist/<int:product_id> — Remove from wishlist
@wishlist_routes.route("/<int:product_id>", methods=["DELETE"])
@login_required
def remove_from_wishlist(product_id):
    item = Wishlist.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    if not item:
        return jsonify({"error": "Product not found in wishlist"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Product removed from wishlist"}), 200