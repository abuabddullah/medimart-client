import { IMedicine } from "./medicine";

export type CartItem = Partial<IMedicine>;
export type ICartItem = Pick<
  IMedicine,
  "_id" | "name" | "price" | "quantity" | "imageURL" | "requiresPrescription"
>;

export interface CartState {
  items: CartItem[];
  loading: boolean;
}
