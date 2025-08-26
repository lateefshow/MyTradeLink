// src/redux/actions/wishlist.tsx
import type { AppDispatch } from "../store";
import { wishlistSlice } from "../reducers/wishlist";

// ✅ Destructure actions from wishlistSlice
const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

// Add to wishlist
export const addToWishlistAction =
  (product: any) => (dispatch: AppDispatch) => {
    dispatch(addToWishlist(product));
  };

// Remove from wishlist
export const removeFromWishlistAction =
  (id: string) => (dispatch: AppDispatch) => {
    dispatch(removeFromWishlist(id));
  };

// Clear wishlist
export const clearWishlistAction = () => (dispatch: AppDispatch) => {
  dispatch(clearWishlist());
};
