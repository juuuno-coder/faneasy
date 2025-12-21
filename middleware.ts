import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname (e.g. 'iu.faneasy.kr' or 'iu.localhost:3000')
  const hostname = req.headers.get("host") || "";

  // Robust hostname parsing
  let currentHost = hostname;
  if (hostname.includes("localhost")) {
    // Handle localhost (with or without port)
    // e.g., "faker.localhost:3600" -> "faker"
    // e.g., "localhost:3600" -> "localhost"
    currentHost = hostname.split(".")[0].split(":")[0];
    if (currentHost === "localhost") {
       // Root localhost access - show landing page
       return NextResponse.next();
    }
  } else if (hostname.includes("faneasy.kr")) {
    // Handle Production
    currentHost = hostname.replace(".faneasy.kr", "");
    if (currentHost === "www" || currentHost === "faneasy") {
      return NextResponse.next();
    }
  } else {
    // Direct domain access without subdomain
    return NextResponse.next();
  }

  // 1. If it's the main domain (Landing Page)
  if (currentHost === "faneasy.kr" || currentHost === "panpage.kr") {
      return NextResponse.next();
  }

  // 2. Otherwise, it is a SUBDOMAIN (e.g. "iu", "bts", "kkang")
  // Rewrite the request to /sites/[subdomain]
  console.log(`Rewriting subdomain ${currentHost} to /sites/${currentHost}`);

  // Check if the path is a fan sub-page (e.g., /fan1, /fan2)
  const pathSegments = url.pathname.split('/').filter(Boolean);
  
  if (pathSegments.length > 0) {
    // This could be a fan sub-page like /fan1
    // Rewrite to /sites/[subdomain]/[fanSlug]
    url.pathname = `/sites/${currentHost}${url.pathname}`;
  } else {
    // Main influencer page
    url.pathname = `/sites/${currentHost}${url.pathname}`;
  }

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
