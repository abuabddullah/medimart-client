export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageURL: string;
  requiresPrescription: boolean;
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
}
