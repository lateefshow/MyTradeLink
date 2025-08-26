// src/redux/slices/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: "buyer" | "seller";
  buyerImage?: string; // For buyer profile image
  sellerImage?: string; // For Seller profile image
  businessName?: string; // For seller
  ownerName?: string; // For seller
  token: string;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: localStorage.getItem("user")
    ? (JSON.parse(localStorage.getItem("user")!) as User)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { setUser, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
