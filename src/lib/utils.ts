import { IMedicine } from "../types/medicine";

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper function to get 3 products with the least stock
export const getLeastStockProducts = (
  medicines: IMedicine[],
  slice: number
) => {
  return [...medicines].sort((a, b) => a.stock - b.stock).slice(0, slice);
};
