const SET_PRODUCTS = "products/setProducts";
const ADD_PRODUCT = "products/addProduct";

const setProducts = (products) => ({
  type: SET_PRODUCTS,
  products,
});

const addProduct = (product) => ({
  type: ADD_PRODUCT,
  product,
});

// THUNKS
export const fetchProducts = () => async (dispatch) => {
  const res = await fetch("http://localhost:5002/api/products");
  if (res.ok) {
    const data = await res.json();
    dispatch(setProducts(data)); // API returns array directly, not wrapped in products property
  }
};

export const createProduct = (payload) => async (dispatch) => {
  const res = await fetch("http://localhost:5002/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addProduct(data));
    return data;
  }
};

const initialState = {
  products: [],
  loading: false,
  error: null
};

export default function productsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRODUCTS: {
      return {
        ...state,
        products: action.products,
        loading: false,
        error: null
      };
    }
    case ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.product]
      };
    default:
      return state;
  }
}