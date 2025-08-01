# from flask import Blueprint, request, jsonify
# from app.models import db, Product
# from flask_login import login_required, current_user

# product_routes = Blueprint('products', __name__)

# # GET all products
# @product_routes.route('/')
# def get_all_products():
#     products = Product.query.all()
#     return jsonify([product.to_dict() for product in products])

# # GET single product by ID
# @product_routes.route('/<int:id>')
# def get_product(id):
#     product = Product.query.get_or_404(id)
#     return product.to_dict()

# # POST create a product
# @product_routes.route('/', methods=['POST'])
# @login_required
# def create_product():
#     data = request.get_json()

#     product = Product(
#         seller_id=current_user.id,
#         title=data['title'],
#         description=data['description'],
#         price=data['price'],
#         cover_image_url=data.get('cover_image_url')
#     )

#     db.session.add(product)
#     db.session.commit()
#     return product.to_dict(), 201

# # PUT update a product
# @product_routes.route('/<int:id>', methods=['PUT'])
# @login_required
# def update_product(id):
#     product = Product.query.get_or_404(id)

#     if product.seller_id != current_user.id:
#         return jsonify({"error": "Unauthorized"}), 403

#     data = request.get_json()
#     product.title = data.get('title', product.title)
#     product.description = data.get('description', product.description)
#     product.price = data.get('price', product.price)
#     product.cover_image_url = data.get('cover_image_url', product.cover_image_url)

#     db.session.commit()
#     return product.to_dict()

# # DELETE a product
# @product_routes.route('/<int:id>', methods=['DELETE'])
# @login_required
# def delete_product(id):
#     product = Product.query.get_or_404(id)

#     if product.seller_id != current_user.id:
#         return jsonify({"error": "Unauthorized"}), 403

#     db.session.delete(product)
#     db.session.commit()
#     return jsonify({"message": "Product deleted"})


from flask import Blueprint, request, jsonify
from app.models import db, Product
from flask_login import login_required, current_user

product_routes = Blueprint('product_routes', __name__)

# GET 
@product_routes.route('/')
def get_all_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])

# GET ID
@product_routes.route('/<int:id>')
def get_product(id):
    product = Product.query.get_or_404(id)
    return product.to_dict()

# GET CURRENT id
@product_routes.route('/manage')
@login_required
def manage_products():
    products = Product.query.filter_by(seller_id=current_user.id).all()
    return jsonify({"products": [product.to_dict() for product in products]})

# POST CREATE
@product_routes.route('/', methods=['POST'])
@login_required
def create_product():
    data = request.get_json()

    product = Product(
        seller_id=current_user.id,
        title=data['title'],
        description=data['description'],
        price=data['price'],
        cover_image_url=data.get('cover_image_url')
    )

    db.session.add(product)
    db.session.commit()
    return product.to_dict(), 201

# PUT UPDATE
@product_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_product(id):
    product = Product.query.get_or_404(id)

    if product.seller_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    product.title = data.get('title', product.title)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.cover_image_url = data.get('cover_image_url', product.cover_image_url)

    db.session.commit()
    return product.to_dict()

# DELETE
@product_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_product(id):
    product = Product.query.get_or_404(id)

    if product.seller_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"})