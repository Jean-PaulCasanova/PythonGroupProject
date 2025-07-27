

// Action Types
const SET_WISHLIST = 'wishlist/setWishlist';

// Action Creators
const setWishlist = (wishlist) => ({
  type: SET_WISHLIST,
  wishlist,
});

// Thunk
export const fetchWishlist = () => async (dispatch) => {
  const res = await fetch('/api/wishlist');
  if (res.ok) {
    const data = await res.json();
    dispatch(setWishlist(data));
  }
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