"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://medimert-server.vercel.app/api";

export async function uploadPrescription(formData: FormData) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/prescriptions/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });

    revalidateTag("PRESCRIPTION");
    return await response.json();
  } catch (error) {
    console.error("Error uploading prescription:", error);
    return {
      success: false,
      message: "Error uploading prescription",
    };
  }
}

export async function getMyPrescriptions() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/prescriptions/my-prescriptions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      next: {
        tags: ["PRESCRIPTION"],
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching user prescriptions:", error);
    return {
      success: false,
      message: "Error fetching user prescriptions",
      data: [],
    };
  }
}

export async function getPrescriptionById(id: string) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/prescriptions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      next: {
        tags: ["PRESCRIPTION"],
      },
    });

    return await response.json();
  } catch (error) {
    console.error(`Error fetching prescription with ID ${id}:`, error);
    return {
      success: false,
      message: `Error fetching prescription with ID ${id}`,
      data: null,
    };
  }
}

export async function getAllPrescriptions(page = 1, limit = 10) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(
      `${API_URL}/prescriptions?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        next: {
          tags: ["PRESCRIPTION"],
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error fetching all prescriptions:", error);
    return {
      success: false,
      message: "Error fetching all prescriptions",
      data: { prescriptions: [], meta: { page, limit, total: 0 } },
    };
  }
}

export async function updatePrescriptionStatus(
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

    const response = await fetch(`${API_URL}/prescriptions/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    });

    revalidateTag("PRESCRIPTION");

    return await response.json();
  } catch (error) {
    console.error(`Error updating prescription status for ID ${id}:`, error);
    return {
      success: false,
      message: `Error updating prescription status for ID ${id}`,
    };
  }
}
