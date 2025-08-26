// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./product/productSlice";
import cartReducer from "./reducers/cart";
import wishlistReducer from "./reducers/wishlist";

/**
 * Load state from localStorage
 */
function loadState() {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}

/**
 * Save state to localStorage
 */
function saveState(state: RootState) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch {
    // ignore write errors
  }
}

const preloadedState = loadState();

/**
 * Create store
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  preloadedState,
});

// Subscribe to save cart + wishlist automatically
store.subscribe(() => {
  const state = store.getState();
  saveState({
    cart: state.cart,
    wishlist: state.wishlist,
    // 👇 Optional: persist auth/product if you want them too
    // auth: state.auth,
    // product: state.product,
  });
});

// ✅ Types (must use `import type` wherever they’re consumed)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
