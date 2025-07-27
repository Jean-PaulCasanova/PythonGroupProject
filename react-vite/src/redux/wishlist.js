// src/redux/wishlist.js

// Action Types
const LOAD_WISHLIST = 'wishlist/loadWishlist';

// Action Creators
const loadWishlist = (wishlistItems) => ({
  type: LOAD_WISHLIST,
  wishlistItems,
});

// Thunk
export const fetchWishlist = () => async (dispatch) => {
  const response = await fetch('/api/wishlist');

  if (response.ok) {
    const data = await response.json();
    dispatch(loadWishlist(data));
  } else {
    // Handle errors if needed
  }
};

// Reducer
const wishlistReducer = (state = [], action) => {
  switch (action.type) {
    case LOAD_WISHLIST:
      return action.wishlistItems;
    default:
      return state;
  }
};

export default wishlistReducer;