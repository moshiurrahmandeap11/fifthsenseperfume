import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "better-auth.session_token";

const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "MODERATOR",
  "INVENTORY_STAFF",
  "ACCOUNTANT",
];

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const isAuthenticated = !!sessionCookie?.value;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = pathname.startsWith("/admin");
  const isCustomerRoute = pathname.startsWith("/customer");

  // 1. If trying to access protected routes without authentication, redirect to /login
  if ((isAdminRoute || isCustomerRoute) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If already logged in, check role for route clearance or /login redirection
  if (isAuthenticated) {
    // Attempt to verify user role from backend
    let userRole: string | null = null;

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${apiBase}/auth/me`, {
        headers: {
          Cookie: `${SESSION_COOKIE_NAME}=${sessionCookie.value}`,
          Authorization: `Bearer ${sessionCookie.value}`,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const json = await res.json();
        userRole = json?.data?.role || json?.role;
      } else if (res.status === 401) {
        // Expired or invalid session token in cookie
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete(SESSION_COOKIE_NAME);
        return response;
      }
    } catch {
      // If backend is unreachable, continue based on cookie presence
    }

    // A) If logged-in user visits auth pages (/login, /register, etc.), redirect to appropriate dashboard
    if (isAuthRoute) {
      if (userRole && ADMIN_ROLES.includes(userRole)) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/customer/dashboard", request.url));
    }

    // B) If customer attempts to access /admin routes, block and redirect to customer dashboard
    if (isAdminRoute && userRole && !ADMIN_ROLES.includes(userRole)) {
      return NextResponse.redirect(new URL("/customer/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/customer/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ],
};
