// react-vite/src/redux/wishlist.js
import { csrfFetch } from './csrf'

// Action Types
const SET_WISHLIST = 'wishlist/setWishlist';

// Action Creators
const setWishlist = (wishlist) => ({
  type: SET_WISHLIST,
  wishlist,
});

// Thunks

export const fetchWishlist = () => async (dispatch) => {
  const res = await fetch('/api/wishlist/');
  if (res.ok) {
    const data = await res.json();
    dispatch(setWishlist(data));
  }
};

export const addToWishlist = (productId) => async (dispatch) => {
  const res = await csrfFetch(`/api/wishlist/${productId}`, {
    method: 'POST',
  });

  if (res.ok) {
    // Refresh wishlist after add
    dispatch(fetchWishlist());
  }
};

export const removeFromWishlist = (productId) => async (dispatch) => {
  const res = await csrfFetch(`/api/wishlist/${productId}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    // Refresh wishlist after removal
    dispatch(fetchWishlist());
  }
};

// Selector
export const selectWishlist = (state) => state.wishlist;

export const isProductWishlisted = (productId) => (state) => {
  return state.wishlist.some((item) => item.productId === productId);
};

// Reducer
const wishlistReducer = (state = [], action) => {
  switch (action.type) {
    case SET_WISHLIST:
      return action.wishlist;
    default:
      return state;
  }
};

export default wishlistReducer;