import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Simple in-memory rate limiter (for demo)
// In production use Redis like @upstash/redis
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response: NextResponse | null = null;

  // Get user IP safely
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Rate limiting for sensitive routes
  if (
    pathname.startsWith("/api/auth/register") ||
    pathname.startsWith("/api/auth/callback/credentials")
  ) {
    if (ip !== "unknown") {
      const currentTime = Date.now();
      const record = rateLimitMap.get(ip);

      if (!record || currentTime > record.resetTime) {
        rateLimitMap.set(ip, {
          count: 1,
          resetTime: currentTime + RATE_LIMIT_WINDOW,
        });
      } else {
        if (record.count >= MAX_REQUESTS) {
          response = new NextResponse("Too Many Requests", { status: 429 });
        } else {
          record.count += 1;
        }
      }
    }
  }

  // Protect admin routes
  if (!response && pathname.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev",
    });

    if (!token) {
      response = NextResponse.redirect(new URL("/login", request.url));
    } else if ((token as any).role !== "ADMIN") {
      response = NextResponse.redirect(new URL("/403", request.url));
    }
  }

  // If no response has been decided, continue to the next handler.
  if (!response) {
    response = NextResponse.next();
  }

  // Add security headers to all responses.
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};