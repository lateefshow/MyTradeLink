// src/redux/features/product/productSlice.tsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store"; // adjust path if needed

// Product type
export interface Product {
  _id?: string;
  name: string;
  categoryType: "product" | "service";
  category: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Slice state
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  success: false,
};

const API_BASE = import.meta.env.VITE_BACKEND_URL;

// ✅ Thunk: Upload new product/service (auth required)
export const uploadProduct = createAsyncThunk<
  Product,
  FormData,
  { state: RootState; rejectValue: string }
>("products/uploadProduct", async (formData, { getState, rejectWithValue }) => {
  try {
    // Get token from Redux auth state
    const token = getState().auth.token;

    if (!token) {
      return rejectWithValue(
        "❌ Not authorized, no token found. Please log in."
      );
    }

    const { data } = await axios.post(
      `${API_BASE}/api/products/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return data.product as Product;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "❌ Failed to upload product/service"
    );
  }
});

// ✅ Thunk: Fetch all products/services (public)
export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_BASE}/api/products`, {
      withCredentials: true,
    });

    return data.products as Product[];
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "❌ Failed to fetch products/services"
    );
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Upload
    builder.addCase(uploadProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(
      uploadProduct.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.success = true;
        state.products.push(action.payload);
      }
    );
    builder.addCase(uploadProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      }
    );
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
