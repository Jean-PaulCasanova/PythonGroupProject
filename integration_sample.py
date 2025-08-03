# Sample Flask app integration
from flask import Flask
from app.api.product_routes import product_routes

app = Flask(__name__)
app.register_blueprint(product_routes, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, port=3967)
