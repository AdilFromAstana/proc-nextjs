import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Типы
interface User {
  id: number | string;
  name: string;
  email: string;
  // другие поля пользователя
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Асинхронные действия
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      // Здесь должен быть реальный API вызов
      // const response = await api.getCurrentUser();
      // return response.data;

      // Пока моковые данные
      return {
        id: 1,
        name: "Test User",
        email: "test@example.com",
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Ошибка загрузки пользователя"
      );
    }
  }
);

// Слайс
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
