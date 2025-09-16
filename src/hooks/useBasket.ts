// src/hooks/useBasket.ts

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/index";
import {
  addProduct,
  removeProduct,
  setRefreshNeedState,
  setBasketVisible,
  clearError, // ← ИМПОРТИРУЕМ
} from "@/store/basketSlice";

export const useBasket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isNeedRefresh, isBasketVisible, loading, error } = useSelector(
    (state: RootState) => state.basket
  );

  return {
    isNeedRefresh,
    isBasketVisible, // ← если нужно где-то читать
    loading,
    error,

    addProduct: (productId: string | number) => dispatch(addProduct(productId)),

    removeProduct: (productId: string | number) =>
      dispatch(removeProduct(productId)),

    setShowBasket: (visible: boolean) => {
      dispatch(setBasketVisible(visible)); // ← УПРАВЛЯЕМ ВИДИМОСТЬЮ КОРЗИНЫ
    },

    refresh: () => {
      dispatch(setRefreshNeedState(true));
      setTimeout(() => {
        dispatch(setRefreshNeedState(false));
      }, 100);
    },

    clearError: () => dispatch(clearError()),
  };
};
