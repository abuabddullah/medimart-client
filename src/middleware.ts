import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = (await cookies()).get("token")?.value;

  let userRole = null;

  if (token) {
    try {
      const decoded = jwt.decode(token) as { role?: string } | null;
      userRole = decoded?.role || null;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  // Define public and protected routes
  const openRoutes = [
    "/",
    "/login",
    "/register",
    "/about",
    "/contact",
    "/shop",
    "/medicine",
    /^\/medicine\/[\w-]+$/,
  ];
  const authRoutes = [
    "/cart",
    "/checkout",
    "/orders",
    "/payment",
    "/payment/failed",
    "/payment/success",
    "/payment/cancelled",
    "/prescriptions",
    "/prescriptions/upload",
    "/profile",
    "/profile/reviews",
  ];
  const adminRoutes = [
    "/admin",
    "/admin/medicines",
    "/admin/orders",
    "/admin/reviews",
    "/admin/users",
  ];

  // Check if route is open (public access allowed)
  if (
    openRoutes.some((route) =>
      typeof route === "string" ? route === pathname : route.test(pathname)
    )
  ) {
    return NextResponse.next();
  }

  // Redirect if not authenticated for auth routes
  if (authRoutes.includes(pathname)) {
    if (!token) {
      return NextResponse.redirect(
        new URL(
          `/login?callbackUrl=${encodeURIComponent(req.nextUrl.href)}`,
          req.url
        )
      );
    }
    return NextResponse.next();
  }

  // Redirect if not admin for admin routes
  if (adminRoutes.includes(pathname)) {
    if (!token || userRole !== "admin") {
      // Force logout
      const response = NextResponse.redirect(
        new URL(
          `/login?callbackUrl=${encodeURIComponent(req.nextUrl.href)}`,
          req.url
        )
      );
      response.cookies.delete("token"); // Log out user
      return response;
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
