import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "./basketSlice";
import authReducer from "./authSlice";
import schoolReducer from "./schoolSlice";
import notificationsReducer from "./notificationsSlice";
import pageReducer from "./pageSlice";

export const store = configureStore({
  reducer: {
    basket: basketReducer,
    auth: authReducer,
    school: schoolReducer,
    notifications: notificationsReducer,
    page: pageReducer,
  },
});

// Типы для использования в useSelector и useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Типизированные хуки
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  selector(store.getState());
