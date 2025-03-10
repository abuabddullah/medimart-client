import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("🚀 ~ middleware ~ pathname:", pathname);
  const token = (await cookies()).get("token")?.value;
  console.log("🚀 ~ middleware ~ token:", token);

  // Define public and protected routes
  const openRoutes = [
    "/",
    "/login",
    "/register",
    "/shop",
    "/medicine",
    /^\/medicine\/[\w-]+$/,
  ];
  const authRoutes = [
    "/cart",
    "/checkout",
    "/orders",
    "/payment",
    "/prescriptions",
    "/prescription/upload",
    "/profile",
    "/profile/review",
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
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Redirect if not admin for admin routes
  if (adminRoutes.includes(pathname)) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

/* new code */
