export type TSearchParams = {
  category?: string;
  manufacturer?: string;
  requiresPrescription?: boolean;
  search?: string;
};

export interface IReviewUserId {
  _id: string;
  name: string;
}

export interface IMedicineReview {
  _id?: string;
  userId?: IReviewUserId;
  productId: string;
  rating: number;
  review: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
