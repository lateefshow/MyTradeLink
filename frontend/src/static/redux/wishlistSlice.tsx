// src/redux/slices/wishlistSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Define the shape of a wishlist item
export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category: string;

  seller: string;
  categoryType: string;
  stock: number;
  description: string;
}

// Define the shape of the wishlist slice state
interface WishlistState {
  items: WishlistItem[];
}

// Initialize state safely with empty array fallback
const initialState: WishlistState = {
  items: Array.isArray(JSON.parse(localStorage.getItem("wishlist") ?? "[]"))
    ? (JSON.parse(localStorage.getItem("wishlist")!) as WishlistItem[])
    : [],
};

// Create the wishlist slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<WishlistItem>) {
      const exists = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (!exists) {
        state.items.push(action.payload);
        localStorage.setItem("wishlist", JSON.stringify(state.items));
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item._id !== action.payload);
      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
    clearWishlist(state) {
      state.items = [];
      localStorage.removeItem("wishlist");
    },
    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const exists = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (exists) {
        // Remove if already in wishlist
        state.items = state.items.filter(
          (item) => item._id !== action.payload._id
        );
      } else {
        // Add if not in wishlist
        state.items.push(action.payload);
      }
      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
