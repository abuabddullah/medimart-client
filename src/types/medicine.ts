export type MedicineCardProps = Partial<IMedicine>;

export interface IMedicine {
  _id: string;
  name: string;
  category: string;
  manufacturer: string;
  price: number;
  stock: number;
  requiresPrescription: boolean;
  description?: string;
  imageURL?: string;
  expiryDate?: string;
  quantity?: any;
}
