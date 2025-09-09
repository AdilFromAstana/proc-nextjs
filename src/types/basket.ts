export interface BasketState {
  isNeedRefresh: boolean;
  loading: boolean;
  error: string | null;
}

export interface AddProductPayload {
  product_id: number | string;
}

export interface RemoveProductPayload {
  product_id: number | string;
}
