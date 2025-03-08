"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://medimert-server.vercel.app/api";

export async function createOrder(orderData: {
  items: { medicineId: string; quantity: number }[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };
  deliveryOption: string;
}) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      message: "Error creating order",
    };
  }
}

export async function getMyOrders() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return {
      success: false,
      message: "Error fetching user orders",
      data: [],
    };
  }
}

export async function getOrderById(id: string) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    return {
      success: false,
      message: `Error fetching order with ID ${id}`,
      data: null,
    };
  }
}

export async function getAllOrders(page = 1, limit = 10) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(
      `${API_URL}/orders/all-orders?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return {
      success: false,
      message: "Error fetching all orders",
      data: { orders: [], meta: { page, limit, total: 0 } },
    };
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error(`Error updating order status for ID ${id}:`, error);
    return {
      success: false,
      message: `Error updating order status for ID ${id}`,
    };
  }
}

export async function updateOrderPrescriptionStatus(
  orderId: string,
  orderPrescriptionStatus: string
) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(
      `${API_URL}/orders/${orderId}/orderPrescriptionStatus`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderPrescriptionStatus }),
        cache: "no-store",
      }
    );

    revalidateTag("ORDER");

    return await response.json();
  } catch (error) {
    console.error(
      `Error updating prescription status for order ID ${orderId}:`,
      error
    );
    return {
      success: false,
      message: `Error updating prescription status for order ID ${orderId}`,
    };
  }
}

export async function cancelOrder(id: string) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/orders/${id}/cancel`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error(`Error cancelling order with ID ${id}:`, error);
    return {
      success: false,
      message: `Error cancelling order with ID ${id}`,
    };
  }
}

export async function initiatePayment(orderId: string) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/payments/initiate/${orderId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error(`Error initiating payment for order ID ${orderId}:`, error);
    return {
      success: false,
      message: `Error initiating payment for order ID ${orderId}`,
    };
  }
}
