import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Типы
interface NotificationsState {
  notifications: number;
  unwatched: number;
  loading: boolean;
}

// Начальное состояние
const initialState: NotificationsState = {
  notifications: 0,
  unwatched: 0,
  loading: false,
};

// Асинхронные действия
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      // Здесь должен быть реальный API вызов
      // const response = await api.getNotifications();
      // return response.data;

      // Пока моковые данные
      return {
        total: 5,
        unwatched: 3,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Ошибка загрузки уведомлений"
      );
    }
  }
);

// Слайс
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setUnwatched: (state, action) => {
      state.unwatched = action.payload;
    },
    incrementUnwatched: (state) => {
      state.unwatched += 1;
    },
    decrementUnwatched: (state) => {
      state.unwatched = Math.max(0, state.unwatched - 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.total;
        state.unwatched = action.payload.unwatched;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setNotifications,
  setUnwatched,
  incrementUnwatched,
  decrementUnwatched,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
