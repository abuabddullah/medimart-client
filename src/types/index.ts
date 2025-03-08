export type TSearchParams = {
  category?: string;
  manufacturer?: string;
  requiresPrescription?: boolean;
  [key: string]?: string | boolean | undefined; 
};
