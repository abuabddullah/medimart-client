import { IMedicine } from "./medicine";

export type CartItem = Partial<IMedicine>;

export interface CartState {
  items: CartItem[];
  loading: boolean;
}
