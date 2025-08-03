import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../../redux/wishlist';
import { addToCart } from '../../redux/cart';
import './WishlistPage.css';

function WishlistPage() {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading, error } = useSelector(state => state.wishlist);
  const { user } = useSelector(state => state.session);
  const [removingItems, setRemovingItems] = useState(new Set());

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  const handleRemoveFromWishlist = async (productId) => {
    setRemovingItems(prev => new Set([...prev, productId]));
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await dispatch(addToCart(product.id, 1));
      // Optionally show success message
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (!user) {
    return (
      <div className="wishlist-page">
        <div className="auth-required">
          <h2>Please log in to view your wishlist</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="loading">Loading your wishlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <div className="error">Error loading wishlist: {error}</div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <h2>Your wishlist is empty</h2>
          <p>Start adding products you love to your wishlist!</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item.productId} className="wishlist-item">
              <div className="product-image">
                <img 
                  src={item.product.cover_image_url ? `/${item.product.cover_image_url}` : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='14' fill='%23666'%3ENo Image%3C/text%3E%3C/svg%3E"} 
                  alt={item.product.title} 
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{item.product.title}</h3>
                <div className="product-price">${item.product.price}</div>
                
                <div className="product-actions">
                  <button 
                    onClick={() => handleAddToCart(item.product)}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                  
                  <button 
                    onClick={() => handleRemoveFromWishlist(item.product.id)}
                    disabled={removingItems.has(item.product.id)}
                    className="remove-btn"
                  >
                    {removingItems.has(item.productId) ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
