// redux/actions/authActions.ts
import type { AppDispatch } from "../store";
import {
  authStart,
  authSuccess,
  authFailure,
  logout,
  updateUserProfile,
} from "../slices/authSlice";
import axios from "axios";

// ✅ Use environment variable instead of hardcoding
const API_BASE = import.meta.env.VITE_BACKEND_URL;

const API_AUTH_URL = `${API_BASE}/api/auth`;
const API_SELLER_URL = `${API_BASE}/api/sellers`;

// -----------------------------
// Login User
// -----------------------------
export const loginUser =
  (email: string, password: string, role: "buyer" | "seller" = "buyer") =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(authStart());

      const { data } = await axios.post(`${API_AUTH_URL}/login`, {
        email,
        password,
        role,
      });

      const user = data.user || data;

      dispatch(authSuccess({ user, token: data.token }));

      // ✅ Persist to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Login failed. Please try again.";
      dispatch(authFailure(errorMsg));
    }
  };

// -----------------------------
// Register User
// -----------------------------
export const registerUser =
  (name: string, email: string, password: string, role: "buyer" | "seller") =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(authStart());

      const { data } = await axios.post(`${API_AUTH_URL}/register`, {
        name,
        email,
        password,
        role,
      });

      const user = data.user || data;

      dispatch(authSuccess({ user, token: data.token }));

      // ✅ Persist to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      dispatch(authFailure(errorMsg));
    }
  };

// -----------------------------
// Update Seller Profile (includes sellerImage / password change etc.)
// -----------------------------
export const updateSellerProfile =
  (formData: FormData) => async (dispatch: AppDispatch, getState: any) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) throw new Error("Unauthorized");

      const { data } = await axios.put(`${API_SELLER_URL}/me`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Update Redux store with latest seller profile
      dispatch(updateUserProfile(data));

      // ✅ Persist updated user to localStorage
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error: any) {
      console.error("Error updating seller profile:", error);
      throw error; // let component handle error toast
    }
  };

// -----------------------------
// Logout User
// -----------------------------
export const logoutUser = () => (dispatch: AppDispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch(logout());
};
