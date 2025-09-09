import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/index";
import {
  addProduct,
  removeProduct,
  setRefreshNeedState,
} from "@/store/basketSlice";

export const useBasket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isNeedRefresh, loading, error } = useSelector(
    (state: RootState) => state.basket
  );

  return {
    isNeedRefresh,
    loading,
    error,
    addProduct: (productId: string | number) => dispatch(addProduct(productId)),
    removeProduct: (productId: string | number) =>
      dispatch(removeProduct(productId)),
    refresh: () => {
      dispatch(setRefreshNeedState(true));
      setTimeout(() => {
        dispatch(setRefreshNeedState(false));
      }, 100);
    },
    clearError: () => dispatch(setRefreshNeedState(false)),
  };
};
