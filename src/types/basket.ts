export interface BasketState {
  isNeedRefresh: boolean;
  loading: boolean;
  error: string | null;
  isBasketVisible: boolean;
}

export interface AddProductPayload {
  product_id: number | string;
}

export interface RemoveProductPayload {
  product_id: number | string;
}
