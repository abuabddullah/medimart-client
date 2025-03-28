export type MedicineCardProps = Partial<IMedicine>;

export interface IMedicine {
  _id: string;
  name: string;
  category: string;
  manufacturer: string;
  price: number;
  stock: number;
  averageRating?: number;
  totalReviews?: number;
  requiresPrescription: boolean;
  description?: string;
  imageURL?: string;
  expiryDate?: string;
  quantity?: any;
  isOffered?: boolean;
}
