from flask import Blueprint, request, jsonify
from app.models import Review, db
from flask_login import login_required, current_user

review_routes = Blueprint('reviews', __name__)

# Get all reviews for a specific product
@review_routes.route('/products/<int:product_id>/reviews', methods=['GET'])
def get_reviews(product_id):
    reviews = Review.query.filter_by(product_id=product_id).all()
    return jsonify([review.to_dict() for review in reviews]), 200

# Create a new review for a specific product
@review_routes.route('/products/<int:product_id>/reviews', methods=['POST'])
@login_required
def create_review(product_id):
    data = request.get_json()
    new_review = Review(
        user_id=current_user.id,
        product_id=product_id,
        rating=data.get('rating'),
        title=data.get('title'),
        content=data.get('content')
    )
    db.session.add(new_review)
    db.session.commit()
    return jsonify(new_review.to_dict()), 201

# Update an existing review by ID
@review_routes.route('/reviews/<int:review_id>', methods=['PUT'])
@login_required
def update_review(review_id):
    review = Review.query.get_or_404(review_id)
    # Ensure the review belongs to the current user
    if review.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    review.rating = data.get('rating', review.rating)
    review.title = data.get('title', review.title)
    review.content = data.get('content', review.content)

    db.session.commit()
    return jsonify(review.to_dict()), 200

# Delete a review by ID
@review_routes.route('/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    review = Review.query.get_or_404(review_id)
    # Ensure the review belongs to the current user
    if review.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'Review deleted successfully'}), 204