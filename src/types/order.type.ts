import { UserType } from "./auth";
import { IMedicine } from "./medicine";

export interface IOrder {
  _id: string;
  userId: Partial<UserType>;
  createdAt: string;
  items: IMedicine[];
  totalPrice: number;
  status: string;
  prescriptionStatus: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}
