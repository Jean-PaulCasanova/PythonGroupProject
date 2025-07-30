// Action Types
const SET_CART = 'cart/SET_CART';
const ADD_TO_CART = 'cart/ADD_TO_CART';
const UPDATE_CART_ITEM = 'cart/UPDATE_CART_ITEM';
const REMOVE_FROM_CART = 'cart/REMOVE_FROM_CART';
const CLEAR_CART = 'cart/CLEAR_CART';
const SET_CART_LOADING = 'cart/SET_CART_LOADING';
const SET_CART_ERROR = 'cart/SET_CART_ERROR';

// Action Creators
const setCart = (cartData) => ({
  type: SET_CART,
  payload: cartData
});

const updateCartItemAction = (itemId, quantity) => ({
  type: UPDATE_CART_ITEM,
  payload: { itemId, quantity }
});

const removeFromCartAction = (itemId) => ({
  type: REMOVE_FROM_CART,
  payload: itemId
});

const clearCartAction = () => ({
  type: CLEAR_CART
});

const setCartLoading = (loading) => ({
  type: SET_CART_LOADING,
  payload: loading
});

const setCartError = (error) => ({
  type: SET_CART_ERROR,
  payload: error
});

// Thunk Actions
export const fetchCart = () => async (dispatch) => {
  dispatch(setCartLoading(true));
  dispatch(setCartError(null));
  
  try {
    const response = await fetch('/api/cart/', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const cartData = await response.json();
      dispatch(setCart(cartData));
    } else {
      throw new Error('Failed to fetch cart');
    }
  } catch (error) {
    dispatch(setCartError(error.message));
  } finally {
    dispatch(setCartLoading(false));
  }
};

export const addToCart = (productId, quantity = 1) => async (dispatch) => {
  dispatch(setCartLoading(true));
  dispatch(setCartError(null));
  
  try {
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ product_id: productId, quantity })
    });
    
    if (response.ok) {
      // Refresh cart after adding
      dispatch(fetchCart());
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add to cart');
    }
  } catch (error) {
    dispatch(setCartError(error.message));
  } finally {
    dispatch(setCartLoading(false));
  }
};

export const updateCartItem = (cartItemId, quantity) => async (dispatch) => {
  dispatch(setCartLoading(true));
  dispatch(setCartError(null));
  
  try {
    const response = await fetch(`/api/cart/update/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ quantity })
    });
    
    if (response.ok) {
      dispatch(updateCartItemAction(cartItemId, quantity));
      // Refresh cart to get updated totals
      dispatch(fetchCart());
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update cart item');
    }
  } catch (error) {
    dispatch(setCartError(error.message));
  } finally {
    dispatch(setCartLoading(false));
  }
};

export const removeFromCart = (cartItemId) => async (dispatch) => {
  dispatch(setCartLoading(true));
  dispatch(setCartError(null));
  
  try {
    const response = await fetch(`/api/cart/remove/${cartItemId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (response.ok) {
      dispatch(removeFromCartAction(cartItemId));
      // Refresh cart to get updated totals
      dispatch(fetchCart());
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to remove from cart');
    }
  } catch (error) {
    dispatch(setCartError(error.message));
  } finally {
    dispatch(setCartLoading(false));
  }
};

export const clearCart = () => async (dispatch) => {
  dispatch(setCartLoading(true));
  dispatch(setCartError(null));
  
  try {
    const response = await fetch('/api/cart/clear', {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (response.ok) {
      dispatch(clearCartAction());
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to clear cart');
    }
  } catch (error) {
    dispatch(setCartError(error.message));
  } finally {
    dispatch(setCartLoading(false));
  }
};

export const checkout = () => async (dispatch) => {
  dispatch(setCartLoading(true));
  dispatch(setCartError(null));
  
  try {
    const response = await fetch('/api/cart/checkout', {
      method: 'POST',
      credentials: 'include'
    });
    
    if (response.ok) {
      const orderData = await response.json();
      dispatch(clearCartAction());
      return orderData;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Checkout failed');
    }
  } catch (error) {
    dispatch(setCartError(error.message));
    throw error;
  } finally {
    dispatch(setCartLoading(false));
  }
};

// Initial State
const initialState = {
  cart_items: [],
  total_price: 0,
  item_count: 0,
  loading: false,
  error: null
};

// Reducer
const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CART:
      return {
        ...state,
        cart_items: action.payload.cart_items || [],
        total_price: action.payload.total_price || 0,
        item_count: action.payload.item_count || 0
      };
    
    case ADD_TO_CART:
      return {
        ...state,
        cart_items: [...state.cart_items, action.payload]
      };
    
    case UPDATE_CART_ITEM:
      return {
        ...state,
        cart_items: state.cart_items.map(item =>
          item.id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case REMOVE_FROM_CART:
      return {
        ...state,
        cart_items: state.cart_items.filter(item => item.id !== action.payload)
      };
    
    case CLEAR_CART:
      return {
        ...state,
        cart_items: [],
        total_price: 0,
        item_count: 0
      };
    
    case SET_CART_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case SET_CART_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    default:
      return state;
  }
};

export default cartReducer;