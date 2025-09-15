import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BasketState } from "@/types/basket";

// Async thunks
export const addProduct = createAsyncThunk(
  "basket/addProduct",
  async (productId: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/basket/add.json", {
        product_id: productId,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error adding product");
    }
  }
);

export const removeProduct = createAsyncThunk(
  "basket/removeProduct",
  async (productId: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/basket/remove.json", {
        product_id: productId,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error removing product");
    }
  }
);

const initialState: BasketState = {
  isNeedRefresh: false,
  loading: false,
  error: null,
  isBasketVisible: false,
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setRefreshNeedState: (state, action) => {
      state.isNeedRefresh = action.payload;
    },
    setBasketVisible: (state, action) => {
      // ← ДОБАВЛЯЕМ
      state.isBasketVisible = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
        state.isNeedRefresh = true;
        setTimeout(() => {
          state.isNeedRefresh = false;
        }, 100);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove product
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state) => {
        state.loading = false;
        state.isNeedRefresh = true;
        setTimeout(() => {
          state.isNeedRefresh = false;
        }, 100);
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setRefreshNeedState, clearError, setBasketVisible } =
  basketSlice.actions;
export default basketSlice.reducer;
