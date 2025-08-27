import type { AppDispatch } from "../store";
import {
  addToCartReducer,
  removeFromCartReducer,
  increaseQuantityReducer,
  decreaseQuantityReducer,
  clearCartReducer,
  updateCartQuantityReducer, // ✅ new reducer
} from "../reducers/cart";

// Add to cart
export const addToCart = (product: any) => (dispatch: AppDispatch) => {
  dispatch(addToCartReducer(product));
};

// Remove from cart
export const removeFromCart = (id: string) => (dispatch: AppDispatch) => {
  dispatch(removeFromCartReducer(id));
};

// Increase quantity
export const increaseQuantity = (id: string) => (dispatch: AppDispatch) => {
  dispatch(increaseQuantityReducer(id));
};

// Decrease quantity
export const decreaseQuantity = (id: string) => (dispatch: AppDispatch) => {
  dispatch(decreaseQuantityReducer(id));
};

// Clear cart
export const clearCart = () => (dispatch: AppDispatch) => {
  dispatch(clearCartReducer());
};

// ✅ Update cart quantity directly
export const updateCartQuantity =
  (id: string, quantity: number) => (dispatch: AppDispatch) => {
    dispatch(updateCartQuantityReducer({ id, quantity }));
  };
