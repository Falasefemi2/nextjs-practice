/** @format */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface User {
  role: "admin" | "user";
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // If accessing login page and already has token, redirect to appropriate dashboard
  if (req.nextUrl.pathname === "/login" && token) {
    try {
      const response = await fetch(`${process.env.API_BASE_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user: User = await response.json();
        const redirectUrl =
          user.role === "admin" ? "/admin-dashboard" : "/user-dashboard";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // If verification fails, clear the token
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // If accessing protected routes without token, redirect to login
  if (!token && !req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Verify token and role for protected routes
  if (
    token &&
    (req.nextUrl.pathname.startsWith("/admin-dashboard") ||
      req.nextUrl.pathname.startsWith("/user-dashboard"))
  ) {
    try {
      const response = await fetch(`${process.env.API_BASE_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.delete("token");
        return response;
      }

      const user: User = await response.json();
      const pathname = req.nextUrl.pathname;

      // Ensure users can only access their designated areas
      if (user.role === "admin" && !pathname.startsWith("/admin-dashboard")) {
        return NextResponse.redirect(new URL("/admin-dashboard", req.url));
      }

      if (user.role === "user" && !pathname.startsWith("/user-dashboard")) {
        return NextResponse.redirect(new URL("/user-dashboard", req.url));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin-dashboard/:path*", "/user-dashboard/:path*"],
};
