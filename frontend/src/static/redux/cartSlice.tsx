// src/redux/slices/cartSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Define the shape of a cart item
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category: string;
}

// Define the shape of the cart slice state
interface CartState {
  items: CartItem[]; // 👈 changed to "items" to match selector
}

// Load cart from localStorage safely
const loadCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem("cart");
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Initialize state
const initialState: CartState = {
  items: loadCart(),
};

// Create the cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        // If item exists, increase quantity
        existingItem.quantity += action.payload.quantity;
      } else {
        // Else, add new item
        state.items.push(action.payload);
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    toggleCartItem(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        // Remove if already exists (toggle off)
        state.items = state.items.filter(
          (item) => item._id !== action.payload._id
        );
      } else {
        // Add new item if not exists
        state.items.push({ ...action.payload, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) {
      const item = state.items.find((i) => i._id === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  toggleCartItem,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
