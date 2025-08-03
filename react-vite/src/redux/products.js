import { API_BASE_URL } from "../config";
import { csrfFetch } from "./csrf";

const SET_PRODUCTS = "products/setProducts";
const ADD_PRODUCT = "products/addProduct";
const SET_ERROR = "products/setError";
const SET_LOADING = "products/setLoading";

const setProducts = (products) => ({
  type: SET_PRODUCTS,
  products,
});

const addProduct = (product) => ({
  type: ADD_PRODUCT,
  product,
});

const setError = (error) => ({
    type: SET_ERROR,
    error,
});

const setLoading = (loading) => ({
    type: SET_LOADING,
    loading,
});

// THUNKS
export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetch(`${API_BASE_URL}/api/products`);
    if (res.ok) {
      const data = await res.json();
      dispatch(setProducts(data)); // API returns array directly, not wrapped in products property
    } else {
      dispatch(setError(`Failed to fetch products: ${res.status}`));
    }
  } catch (error) {
    dispatch(setError(error.toString()));
  }
};

export const createProduct = (payload) => async (dispatch) => {
  try {
    const res = await csrfFetch(`${API_BASE_URL}/api/products/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      dispatch(addProduct(data));
      return data;
    } else {
      const errorData = await res.json();
      dispatch(setError(errorData));
      return errorData;
    }
  } catch (error) {
      dispatch(setError(error.toString()));
      return error;
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
    case SET_ERROR:
        return {
            ...state,
            error: action.error,
            loading: false,
        };
    case SET_LOADING:
        return {
            ...state,
            loading: action.loading,
        };
    default:
      return state;
  }
}