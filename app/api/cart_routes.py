from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, ShoppingCart, Product

cart_routes = Blueprint('cart', __name__)

@cart_routes.route('/')
@login_required
def get_cart():
    """
    Get all items in the current user's shopping cart
    """
    cart_items = ShoppingCart.query.filter_by(user_id=current_user.id).all()
    
    cart_data = []
    total_price = 0
    
    for item in cart_items:
        product = Product.query.get(item.product_id)
        if product:
            item_data = {
                'id': item.id,
                'product_id': item.product_id,
                'quantity': item.quantity,
                'product': product.to_dict(),
                'subtotal': float(product.price * item.quantity)
            }
            cart_data.append(item_data)
            total_price += item_data['subtotal']
    
    return jsonify({
        'cart_items': cart_data,
        'total_price': total_price,
        'item_count': len(cart_data)
    })

@cart_routes.route('/add', methods=['POST'])
@login_required
def add_to_cart():
    """
    Add a product to the shopping cart
    """
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    # Validate product exists
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    # Check if item already exists in cart
    existing_item = ShoppingCart.query.filter_by(
        user_id=current_user.id,
        product_id=product_id
    ).first()
    
    if existing_item:
        # Update quantity
        existing_item.quantity += quantity
    else:
        # Create new cart item
        new_item = ShoppingCart(
            user_id=current_user.id,
            product_id=product_id,
            quantity=quantity
        )
        db.session.add(new_item)
    
    db.session.commit()
    
    return jsonify({'message': 'Product added to cart successfully'}), 201

@cart_routes.route('/update/<int:cart_item_id>', methods=['PUT'])
@login_required
def update_cart_item(cart_item_id):
    """
    Update quantity of a cart item
    """
    cart_item = ShoppingCart.query.filter_by(
        id=cart_item_id,
        user_id=current_user.id
    ).first()
    
    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404
    
    data = request.get_json()
    new_quantity = data.get('quantity')
    
    if new_quantity <= 0:
        db.session.delete(cart_item)
    else:
        cart_item.quantity = new_quantity
    
    db.session.commit()
    
    return jsonify({'message': 'Cart item updated successfully'})

@cart_routes.route('/remove/<int:cart_item_id>', methods=['DELETE'])
@login_required
def remove_from_cart(cart_item_id):
    """
    Remove an item from the shopping cart
    """
    cart_item = ShoppingCart.query.filter_by(
        id=cart_item_id,
        user_id=current_user.id
    ).first()
    
    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404
    
    db.session.delete(cart_item)
    db.session.commit()
    
    return jsonify({'message': 'Item removed from cart successfully'})

@cart_routes.route('/clear', methods=['DELETE'])
@login_required
def clear_cart():
    """
    Clear all items from the shopping cart
    """
    cart_items = ShoppingCart.query.filter_by(user_id=current_user.id).all()
    
    for item in cart_items:
        db.session.delete(item)
    
    db.session.commit()
    
    return jsonify({'message': 'Cart cleared successfully'})

@cart_routes.route('/checkout', methods=['POST'])
@login_required
def checkout():
    """
    Process checkout - simulate order creation and clear cart
    """
    cart_items = ShoppingCart.query.filter_by(user_id=current_user.id).all()
    
    if not cart_items:
        return jsonify({'error': 'Cart is empty'}), 400
    
    # Calculate total
    total_price = 0
    order_items = []
    
    for item in cart_items:
        product = Product.query.get(item.product_id)
        if product:
            subtotal = float(product.price * item.quantity)
            total_price += subtotal
            order_items.append({
                'product_id': item.product_id,
                'product_title': product.title,
                'quantity': item.quantity,
                'price': float(product.price),
                'subtotal': subtotal
            })
    
    # Clear cart after successful checkout
    for item in cart_items:
        db.session.delete(item)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Checkout successful!',
        'order_summary': {
            'items': order_items,
            'total_price': total_price,
            'order_date': 'simulated_order_date'
        }
    }), 201