import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeFromCart, clearCart, checkout } from '../../redux/cart';
import './ShoppingCart.css';

function ShoppingCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart_items, total_price, item_count, loading, error } = useSelector(state => state.cart);
  const user = useSelector(state => state.session.user);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(cartItemId));
    } else {
      dispatch(updateCartItem(cartItemId, newQuantity));
    }
  };

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeFromCart(cartItemId));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      await dispatch(checkout());
      setCheckoutSuccess(true);
      setTimeout(() => {
        setCheckoutSuccess(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <p>Please log in to view your cart.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  if (checkoutSuccess) {
    return (
      <div className="cart-container">
        <div className="checkout-success">
          <h1>🎉 Order Successful!</h1>
          <p>Thank you for your purchase! You will be redirected to the home page shortly.</p>
        </div>
      </div>
    );
  }

  if (cart_items.length === 0) {
    return (
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart ({item_count} items)</h1>
        <button onClick={handleClearCart} className="clear-cart-btn">
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart_items.map(item => (
            <div key={item.id} className="cart-item">
              <img 
                src={item.product.cover_image_url} 
                alt={item.product.title}
                className="cart-item-image"
              />
              
              <div className="cart-item-details">
                <h3>{item.product.title}</h3>
                <p className="cart-item-price">${item.product.price}</p>
                
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                
                <p className="subtotal">Subtotal: ${item.subtotal.toFixed(2)}</p>
              </div>
              
              <button 
                onClick={() => handleRemoveItem(item.id)}
                className="remove-item-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Items ({item_count}):</span>
              <span>${total_price.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div className="summary-line total">
              <span>Total:</span>
              <span>${total_price.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="checkout-btn"
            >
              {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            
            <button 
              onClick={() => navigate('/')}
              className="continue-shopping-btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;