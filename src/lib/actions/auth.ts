"use server"

import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function registerUser(name: string, email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
      cache: "no-store",
    })

    const data = await response.json()

    if (data.success) {
      ;(await cookies()).set("token", data.data.token)
    }

    return data
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: "An error occurred during registration",
    }
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    })

    const data = await response.json()

    if (data.success) {
      cookies().set("token", data.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })
    }

    return data
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "An error occurred during login",
    }
  }
}

export async function getUserProfile() {
  try {
    const token = cookies().get("token")?.value

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      }
    }

    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    return await response.json()
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return {
      success: false,
      message: "Error fetching user profile",
    }
  }
}

export async function updateUserProfile(userData: {
  name?: string
  phoneNumber?: string
  address?: {
    address: string
    city: string
    postalCode: string
    country: string
  }
}) {
  try {
    const token = cookies().get("token")?.value

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      }
    }

    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
      cache: "no-store",
    })

    return await response.json()
  } catch (error) {
    console.error("Error updating user profile:", error)
    return {
      success: false,
      message: "Error updating user profile",
    }
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const token = cookies().get("token")?.value

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      }
    }

    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
      cache: "no-store",
    })

    return await response.json()
  } catch (error) {
    console.error("Error changing password:", error)
    return {
      success: false,
      message: "Error changing password",
    }
  }
}

export async function getAllUsers() {
  try {
    const token = cookies().get("token")?.value

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      }
    }

    const response = await fetch(`${API_URL}/auth/all-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    return await response.json()
  } catch (error) {
    console.error("Error fetching users:", error)
    return {
      success: false,
      message: "Error fetching users",
    }
  }
}

export async function updateUserStatus(targetUserId: string, status: "active" | "inactive") {
  try {
    const token = cookies().get("token")?.value

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      }
    }

    const response = await fetch(`${API_URL}/auth/update-status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUserId, status }),
      cache: "no-store",
    })

    return await response.json()
  } catch (error) {
    console.error("Error updating user status:", error)
    return {
      success: false,
      message: "Error updating user status",
    }
  }
}

export async function logoutUser() {
  cookies().delete("token")
  return { success: true }
}

