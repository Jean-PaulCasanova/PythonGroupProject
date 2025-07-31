from flask import Blueprint, request
from app.models import Review, db
from flask_login import login_required, current_user
from app.forms.review_form import ReviewForm

review_routes = Blueprint('reviews', __name__)

# Get all reviews for a specific product
@review_routes.route('/products/<int:product_id>/reviews', methods=['GET'])
def get_reviews(product_id):
    reviews = Review.query.filter_by(product_id=product_id).all()
    return [review.to_dict() for review in reviews], 200

# Create a new review for a specific product
@review_routes.route('/products/<int:product_id>/reviews', methods=['POST'])
@login_required
def create_review(product_id):
    form = ReviewForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    if form.validate_on_submit():
        new_review = Review(
            user_id=current_user.id,
            product_id=product_id,
            rating=form.data['rating'],
            title=form.data['title'],
            content=form.data['content']
        )
        db.session.add(new_review)
        db.session.commit()
        return new_review.to_dict(), 201

    return {'errors': form.errors}, 400

# Get current user's reviews
@review_routes.route('/my-reviews', methods=['GET'])
@login_required
def get_my_reviews():
    reviews = Review.query.filter_by(user_id=current_user.id).all()
    return [review.to_dict() for review in reviews], 200

# Update an existing review by ID
@review_routes.route('/reviews/<int:review_id>', methods=['PUT'])
@login_required
def update_review(review_id):
    review = Review.query.get_or_404(review_id)
    if review.user_id != current_user.id:
        return {'error': 'Unauthorized'}, 403

    form = ReviewForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    if form.validate_on_submit():
        review.rating = form.data['rating']
        review.title = form.data['title']
        review.content = form.data['content']
        db.session.commit()
        return review.to_dict(), 200

    return {'errors': form.errors}, 400

# Delete a review by ID
@review_routes.route('/reviews/<int:review_id>', methods=['DELETE'])
@login_required
def delete_review(review_id):
    review = Review.query.get_or_404(review_id)
    if review.user_id != current_user.id:
        return {'error': 'Unauthorized'}, 403

    db.session.delete(review)
    db.session.commit()
    return {'message': 'Review deleted successfully'}, 200