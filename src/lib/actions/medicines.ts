"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getMedicines(
  page = 1,
  limit = 10,
  searchParams = { category: "", manufacturer: "", requiresPrescription: false }
) {
  try {
    let url = `${API_URL}/medicines?page=${page}&limit=${limit}`;
    if (searchParams.category) {
      url += `&category=${searchParams.category}`;
    }
    if (searchParams.manufacturer) {
      url += `&manufacturer=${searchParams.manufacturer}`;
    }
    if (searchParams.requiresPrescription) {
      url += `&requiresPrescription=${searchParams.requiresPrescription}`;
    }

    if (searchParams) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(searchParams)) {
        if (value) params.append(key, value);
      }
      if (params.toString()) {
        url += `&${params.toString()}`;
      }
    }

    const response = await fetch(url, {
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return {
      success: false,
      message: "Error fetching medicines",
      data: [],
      meta: { page, limit, total: 0 },
    };
  }
}

export async function getMedicineById(id: string) {
  try {
    const response = await fetch(`${API_URL}/medicines/${id}`, {
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error(`Error fetching medicine with ID ${id}:`, error);
    return {
      success: false,
      message: `Error fetching medicine with ID ${id}`,
      data: null,
    };
  }
}

export async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/medicines/categories`, {
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      message: "Error fetching categories",
      data: [],
    };
  }
}

export async function getManufacturers() {
  try {
    const response = await fetch(`${API_URL}/medicines/manufacturers`, {
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching manufacturers:", error);
    return {
      success: false,
      message: "Error fetching manufacturers",
      data: [],
    };
  }
}

export async function createMedicine(medicineData: any) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/medicines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(medicineData),
      cache: "no-store",
    });
    const data = await response.json();
    console.log("🚀 ~ createMedicine ~ response:", data);
    return data;
  } catch (error) {
    console.error("Error creating medicine:", error);
    return {
      success: false,
      message: "Error creating medicine",
    };
  }
}

export async function updateMedicine(id: string, medicineData: any) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/medicines/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(medicineData),
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error(`Error updating medicine with ID ${id}:`, error);
    return {
      success: false,
      message: `Error updating medicine with ID ${id}`,
    };
  }
}

export async function deleteMedicine(id: string) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/medicines/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error(`Error deleting medicine with ID ${id}:`, error);
    return {
      success: false,
      message: `Error deleting medicine with ID ${id}`,
    };
  }
}
