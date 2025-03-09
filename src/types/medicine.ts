export interface MedicineCardProps {
  _id: string;
  name: string;
  price: number;
  category: string;
  manufacturer: string;
  imageURL: string;
  requiresPrescription: boolean;
}

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
