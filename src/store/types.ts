// Общие типы для всего приложения
export interface RootState {
  basket: BasketState;
  // другие слайсы будут здесь
}

export interface BasketState {
  isNeedRefresh: boolean;
  loading: boolean;
  error: string | null;
}

export interface Product {
  id: number | string;
  name: string;
  // другие поля продукта
}
