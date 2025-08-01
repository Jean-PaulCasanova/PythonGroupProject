<<<<<<< HEAD
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
=======
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../../redux/wishlist';
import './Wishlist.css';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
  const user = useSelector((state) => state.session.user);
>>>>>>> origin/JP

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

<<<<<<< HEAD
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
                  src={item.coverImageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='14' fill='%23666'%3ENo Image%3C/text%3E%3C/svg%3E"} 
                  alt={item.title} 
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{item.title}</h3>
                <div className="product-price">${item.price}</div>
                
                <div className="product-actions">
                  <button 
                    onClick={() => handleAddToCart({ id: item.productId, title: item.title, price: item.price })}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                  
                  <button 
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    disabled={removingItems.has(item.productId)}
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
=======
  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  if (!user) return <p>You must be logged in to view your wishlist.</p>;
  if (!wishlist) return <p>Loading wishlist...</p>;

  return (
    <div className="wishlist-page">
      <h1>Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>No items in your wishlist yet!</p>
      ) : (
        <ul className="wishlist-grid">
          {wishlist.map((item) => (
            <li key={item.id} className="wishlist-item">
              <img src={item.coverImageUrl} alt={item.title} />
              <h3>{item.title}</h3>
              <p>${item.price}</p>
              <button
                className="remove-wishlist-button"
                onClick={() => handleRemove(item.productId)}
              >
                ❌ Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
>>>>>>> origin/JP
