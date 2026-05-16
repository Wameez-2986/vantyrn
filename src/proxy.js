import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is missing!");
}
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Define Public Paths
  const isPublicPage = pathname === "/admin-login";
  const isPublicApi = pathname === "/api/admin/login";
  const isApiRoute = pathname.startsWith("/api/");

  // 2. Get Token from Cookies
  const token = request.cookies.get("admin_token")?.value;

  // 3. Handle Public Paths (Redirect if already logged in)
  if (isPublicPage || isPublicApi) {
    if (token) {
      try {
        await jwtVerify(token, secretKey);
        // Valid session exists, don't allow re-login
        if (isPublicPage) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch (e) {
        // Token invalid, allow access to login page
      }
    }
    return NextResponse.next();
  }

  // 4. Define Protected Paths
  // We protect the main dashboard areas and all administrative APIs
  const isProtectedRoute = 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/vendors") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/partners") ||
    pathname.startsWith("/customers") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/templates") ||
    (isApiRoute && !isPublicApi);

  if (isProtectedRoute) {
    if (!token) {
      // Not authenticated
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }

    try {
      // Verify token
      const { payload } = await jwtVerify(token, secretKey);
      
      // Basic security check: ensure it has admin role if we set it
      if (payload.role !== "admin") {
        throw new Error("Invalid role");
      }

      return NextResponse.next();
    } catch (error) {
      // Token verification failed
      console.error("Middleware Auth Error:", error.message);
      
      const response = pathname.startsWith("/api/") 
        ? NextResponse.json({ error: "Session expired or invalid" }, { status: 401 })
        : NextResponse.redirect(new URL("/admin-login", request.url));
      
      // Clear the invalid cookie
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

// Config to match only the paths we care about for performance
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
