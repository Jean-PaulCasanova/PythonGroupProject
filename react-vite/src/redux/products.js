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
  const res = await fetch("http://localhost:5000/api/products");
  if (res.ok) {
    const data = await res.json();
    dispatch(setProducts(data.products)); // Adjust based on your response shape
  }
};

export const createProduct = (payload) => async (dispatch) => {
  const res = await fetch("http://localhost:5000/api/products", {
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

const initialState = {};

export default function productsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRODUCTS: {
      const newState = {};
      action.products.forEach((product) => {
        newState[product.id] = product;
      });
      return newState;
    }
    case ADD_PRODUCT:
      return { ...state, [action.product.id]: action.product };
    default:
      return state;
  }
}