// redux/slices/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Buyer {
  firstName: string;
  lastName: string;
  email: string;
  role: "buyer";
  buyerImage?: string; // optional (if you want buyer avatars too)
}

interface Seller {
  businessName: string;
  ownerName: string;
  email: string;
  role: "seller";
  sellerImage?: string; // ✅ added seller image
}

type User = Buyer | Seller;

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// ✅ Load from localStorage if available
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const initialState: AuthState = {
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  token: storedToken || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;

      // ✅ Persist in localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    authFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;

      // ✅ Clear storage on failure
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;

      // ✅ Remove from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    // ✅ NEW reducer: update user profile instantly
    updateUserProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user)); // keep storage in sync
      }
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  logout,
  updateUserProfile,
} = authSlice.actions;
export default authSlice.reducer;
