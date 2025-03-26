"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://medimert-server.vercel.app/api";

export async function getAllMedicineReviews(id: string) {
  try {
    const response = await fetch(`${API_URL}/medicineReviews/${id}`, {
      cache: "no-store",
      next: { tags: ["medicineReviews"] },
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: "Error fetching reviews",
      data: [],
    };
  }
}

// Create a new review
export async function createMedicineReview(reviewData: {
  medicineId: string;
  rating: number;
  review: string;
}) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/medicineReviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
      cache: "no-store",
    });

    const result = await response.json();

    // Revalidate the reviews cache
    revalidateTag("medicineReviews");

    return result;
  } catch (error) {
    return {
      success: false,
      message: "Error creating review",
    };
  }
}
