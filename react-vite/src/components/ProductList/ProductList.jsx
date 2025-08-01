import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../redux/products';
import { addToCart } from '../../redux/cart';
import { addToWishlist } from '../../redux/wishlist';
import './ProductList.css';

function ProductList() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.session);
  const [addingToCart, setAddingToCart] = useState({});
  const [addingToWishlist, setAddingToWishlist] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }

    try {
      setAddingToCart(prev => ({ ...prev, [productId]: true }));
      await dispatch(addToCart(productId, 1));
      alert('Product added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToWishlist = async (productId) => {
    if (!user) {
      alert('Please log in to add items to your wishlist.');
      return;
    }

    try {
      setAddingToWishlist(prev => ({ ...prev, [productId]: true }));
      await dispatch(addToWishlist(productId));
      alert('Product added to wishlist!');
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      alert('Failed to add product to wishlist. Please try again.');
    } finally {
      setAddingToWishlist(prev => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="product-list-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-container">
        <div className="error">Error loading products: {error}</div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1>🛍️ Shop Our Products</h1>
        <p>Discover amazing products and add them to your cart!</p>
        
        {user && (
          <div className="seller-actions">
            <Link to="/products/new" className="btn btn-success">
              ➕ Create New Product
            </Link>
            <Link to="/products/manage" className="btn btn-info">
              ⚙️ Manage My Products
            </Link>
          </div>
        )}
      </div>
      
      {products && products.length > 0 ? (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={product.cover_image_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='14' fill='%23666'%3ENo Image%3C/text%3E%3C/svg%3E"} 
                  alt={product.title} 
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-name">
                  <Link to={`/products/${product.id}`}>{product.title}</Link>
                </h3>
                
                <p className="product-description">{product.description}</p>
                
                <div className="product-price">
                  ${parseFloat(product.price).toFixed(2)}
                </div>
                
                <div className="product-actions">
                  <Link 
                    to={`/products/${product.id}#reviews`} 
                    className="btn btn-secondary"
                  >
                    Reviews
                  </Link>
                  
                  {user && (
                    <>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingToCart[product.id]}
                        className="btn btn-primary add-to-cart-btn"
                      >
                        {addingToCart[product.id] ? (
                          <>🔄 Adding...</>
                        ) : (
                          <>🛒 Add to Cart</>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleAddToWishlist(product.id)}
                        disabled={addingToWishlist[product.id]}
                        className="btn btn-outline-danger"
                      >
                        {addingToWishlist[product.id] ? (
                          <>🔄 Adding...</>
                        ) : (
                          <>❤️ Wishlist</>
                        )}
                      </button>
                    </>
                  )}
                  
                  {!user && (
                    <Link to="/login" className="btn btn-primary">
                      Login to Purchase
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-products">
          <h2>No products available</h2>
          <p>Check back later for new products!</p>
        </div>
      )}
    </div>
  );
}

export default ProductList;