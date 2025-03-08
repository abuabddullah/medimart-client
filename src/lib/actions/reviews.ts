"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://medimert-server.vercel.app/api";

// Get all reviews (admin)
export async function getAllReviews(page = 1, limit = 10) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(
      `${API_URL}/reviews?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        next: { tags: ["reviews"] },
      }
    );

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: "Error fetching reviews",
      data: [],
      meta: { page, limit, total: 0 },
    };
  }
}

// Get user's own reviews
export async function getMyReviews() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/reviews/my-reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      next: { tags: ["my-reviews"] },
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: "Error fetching your reviews",
      data: [],
    };
  }
}

// Get a specific review by ID
export async function getReviewById(id: string) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      next: { tags: ["reviews"] },
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: `Error fetching review with ID ${id}`,
      data: null,
    };
  }
}

// Create a new review
export async function createReview(reviewData: {
  rating: number;
  comment: string;
}) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/reviews`, {
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
    revalidateTag("reviews");
    revalidateTag("my-reviews");

    return result;
  } catch (error) {
    return {
      success: false,
      message: "Error creating review",
    };
  }
}

// Update a review
export async function updateReview(
  id: string,
  reviewData: { rating: number; comment: string }
) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/reviews/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
      cache: "no-store",
    });

    const result = await response.json();

    // Revalidate the reviews cache
    revalidateTag("reviews");
    revalidateTag("my-reviews");

    return result;
  } catch (error) {
    return {
      success: false,
      message: `Error updating review with ID ${id}`,
    };
  }
}

// Delete a review
export async function deleteReview(id: string) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/reviews/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await response.json();

    // Revalidate the reviews cache
    revalidateTag("reviews");
    revalidateTag("my-reviews");

    return result;
  } catch (error) {
    return {
      success: false,
      message: `Error deleting review with ID ${id}`,
    };
  }
}

// Update review status (admin only)
export async function updateReviewStatus(
  id: string,
  status: "approved" | "rejected"
) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/reviews/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    });

    const result = await response.json();

    // Revalidate the reviews cache
    revalidateTag("reviews");
    revalidateTag("my-reviews");

    return result;
  } catch (error) {
    return {
      success: false,
      message: `Error updating status for review ID ${id}`,
    };
  }
}

// Get approved reviews for public display
export async function getApprovedReviews(limit = 6) {
  try {
    const response = await fetch(`${API_URL}/reviews/approved?limit=${limit}`, {
      cache: "no-store",
      next: { tags: ["reviews"] },
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: "Error fetching approved reviews",
      data: [],
    };
  }
}
