export interface IReview {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface IMyReview {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface ReviewFormProps {
  onSuccess?: () => void;
}
