// src/redux/reducers/cart.tsx
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  _id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartReducer: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existing = state.cartItems.find((p) => p._id === item._id);
      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        state.cartItems.push({ ...item, quantity: item.quantity || 1 });
      }
    },
    removeFromCartReducer: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
    },
    increaseQuantityReducer: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((p) => p._id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantityReducer: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((p) => p._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.cartItems = state.cartItems.filter(
          (p) => p._id !== action.payload
        );
      }
    },
    clearCartReducer: (state) => {
      state.cartItems = [];
    },
    // ✅ New reducer for updating quantity directly
    updateCartQuantityReducer: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((p) => p._id === id);
      if (item) {
        item.quantity = quantity > 0 ? quantity : 1; // prevent 0 or negative
      }
    },
  },
});

export const {
  addToCartReducer,
  removeFromCartReducer,
  increaseQuantityReducer,
  decreaseQuantityReducer,
  clearCartReducer,
  updateCartQuantityReducer, // ✅ export new reducer
} = cartSlice.actions;

export default cartSlice.reducer;
