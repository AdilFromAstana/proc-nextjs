import { createSlice } from "@reduxjs/toolkit";

// Типы
interface PageState {
  taskListState: boolean;
  basketShowedState: boolean;
  chatShowedState: boolean;
  switchOrgShowedState: boolean; // Добавляем новое состояние
}

const initialState: PageState = {
  taskListState: false,
  basketShowedState: false,
  chatShowedState: false,
  switchOrgShowedState: false, // Инициализируем
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
    setChatShowedState: (state, action) => {
      state.chatShowedState = action.payload;
    },
    setSwitchOrgShowedState: (state, action) => {
      state.switchOrgShowedState = action.payload; // Добавляем
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
    showChat: (state) => {
      state.chatShowedState = true;
    },
    hideChat: (state) => {
      state.chatShowedState = false;
    },
    toggleChat: (state) => {
      state.chatShowedState = !state.chatShowedState;
    },
    // Добавляем новые экшены для переключения организации
    showSwitchOrg: (state) => {
      state.switchOrgShowedState = true;
    },
    hideSwitchOrg: (state) => {
      state.switchOrgShowedState = false;
    },
    toggleSwitchOrg: (state) => {
      state.switchOrgShowedState = !state.switchOrgShowedState;
    },
  },
});

export const {
  setTaskListState,
  setBasketShowedState,
  setChatShowedState,
  setSwitchOrgShowedState, // Экспортируем
  showTaskList,
  hideTaskList,
  toggleTaskList,
  showBasket,
  hideBasket,
  toggleBasket,
  showChat,
  hideChat,
  toggleChat,
  showSwitchOrg, // Экспортируем
  hideSwitchOrg, // Экспортируем
  toggleSwitchOrg, // Экспортируем
} = pageSlice.actions;
export default pageSlice.reducer;
