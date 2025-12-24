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
       // Root localhost access
       // Check if path looks like a site slug (e.g., /bizon, /kkang)
       // If so, rewrite to /sites/[slug]
       const siteRoutes = ['bizon', 'kkang', 'fan1', 'fan2', 'fan3', 'fan4']; // Known site slugs
       const pathParts = url.pathname.split('/').filter(Boolean);
       
       if (pathParts.length > 0 && siteRoutes.includes(pathParts[0])) {
         // Rewrite /bizon -> /sites/bizon
         const siteName = pathParts[0];
         const restPath = pathParts.slice(1).join('/');
         url.pathname = `/sites/${siteName}${restPath ? '/' + restPath : ''}`;
         console.log(`Path-based rewrite: /${siteName} -> ${url.pathname}`);
         return NextResponse.rewrite(url);
       }
       
       return NextResponse.next();
    }
  } else if (hostname.includes("faneasy.kr")) {
    // Handle Production (faneasy.kr)
    currentHost = hostname.replace(".faneasy.kr", "");
    if (currentHost === "www" || currentHost === "faneasy") {
      return NextResponse.next();
    }
  } else if (hostname.includes("designd.co.kr")) {
    // Handle New Domain (designd.co.kr)
    currentHost = hostname.replace(".designd.co.kr", "");
    // If it's just designd.co.kr or www.designd.co.kr, let it go to the original route (or show landing)
    // But since you want kkang.designd.co.kr to work, we extract 'kkang'
    if (currentHost === "www" || currentHost === "designd" || currentHost === hostname) {
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

  // 2. Allow /admin, /login, /api routes to pass through without rewriting
  if (url.pathname.startsWith("/admin") || 
      url.pathname.startsWith("/login") || 
      url.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 3. Otherwise, it is a SUBDOMAIN (e.g. "iu", "bts", "kkang")
  // Rewrite the request to /sites/[subdomain]
  console.log(`Rewriting subdomain ${currentHost} to /sites/${currentHost}`);

  // IMPORTANT: If the path already starts with /sites/, it's likely a recursive request or a direct link.
  // We should NOT double-prefix it.
  if (url.pathname.startsWith("/sites/")) {
    return NextResponse.next();
  }

  // Rewrite to the appropriate site folder
  url.pathname = `/sites/${currentHost}${url.pathname}`;

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
