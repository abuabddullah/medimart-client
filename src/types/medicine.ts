export interface MedicineCardProps {
  _id: string;
  name: string;
  price: number;
  category: string;
  manufacturer: string;
  imageURL: string;
  requiresPrescription: boolean;
}
