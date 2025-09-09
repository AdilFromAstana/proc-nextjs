import { createSlice } from "@reduxjs/toolkit";

// Типы
interface PageState {
  taskListState: boolean;
  basketShowedState: boolean;
}

// Начальное состояние
const initialState: PageState = {
  taskListState: false,
  basketShowedState: false,
};

// Слайс
const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setTaskListState: (state, action) => {
      state.taskListState = action.payload;
    },
    setBasketShowedState: (state, action) => {
      state.basketShowedState = action.payload;
    },
    showTaskList: (state) => {
      state.taskListState = true;
    },
    hideTaskList: (state) => {
      state.taskListState = false;
    },
    toggleTaskList: (state) => {
      state.taskListState = !state.taskListState;
    },
    showBasket: (state) => {
      state.basketShowedState = true;
    },
    hideBasket: (state) => {
      state.basketShowedState = false;
    },
    toggleBasket: (state) => {
      state.basketShowedState = !state.basketShowedState;
    },
  },
});

export const {
  setTaskListState,
  setBasketShowedState,
  showTaskList,
  hideTaskList,
  toggleTaskList,
  showBasket,
  hideBasket,
  toggleBasket,
} = pageSlice.actions;
export default pageSlice.reducer;
