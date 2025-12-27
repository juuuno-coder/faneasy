import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // 1. Allow root level system routes and static files to pass through
  const isStaticFile = url.pathname.includes(".") || url.pathname.startsWith("/_next") || url.pathname.startsWith("/images");
  const systemRoutes = ["/admin", "/login", "/api", "/sites", "/mypage", "/profile", "/checkout", "/favicon", "/public"];
  
  if (isStaticFile || systemRoutes.some(route => url.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 2. Handle Subdomain access (e.g. iu.faneasy.kr)
  // Skip this if on main domains or localhost (unless it's a sub-localhost like test.localhost)
  const mainDomains = ["faneasy.kr", "panpage.kr", "designd.co.kr", "www.faneasy.kr", "www.designd.co.kr", "localhost:3000", "localhost:3100", "localhost:3600"];
  
  if (!mainDomains.includes(hostname)) {
    let subdomain = "";
    if (hostname.includes("faneasy.kr")) subdomain = hostname.replace(".faneasy.kr", "");
    else if (hostname.includes("designd.co.kr")) subdomain = hostname.replace(".designd.co.kr", "");
    else if (hostname.includes(".localhost")) subdomain = hostname.split(".")[0];
    else if (!hostname.includes("localhost")) subdomain = hostname.split(".")[0];

    if (subdomain && subdomain !== "www" && subdomain !== "localhost") {
      console.log(`Rewriting subdomain ${subdomain} to /sites/${subdomain}`);
      url.pathname = `/sites/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // 3. Handle Path-based access (e.g. faneasy.kr/bizon)
  // Known site slugs that should be treated as sites when at the root path
  const siteRoutes = ['bizon', 'kkang', 'fan1', 'fan2', 'fan3', 'fan4', 'tech', 'mz', 'growth', 'agency'];
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  if (pathParts.length > 0 && siteRoutes.includes(pathParts[0])) {
    const siteName = pathParts[0];
    const restPath = pathParts.slice(1).join('/');
    url.pathname = `/sites/${siteName}${restPath ? '/' + restPath : ''}`;
    console.log(`Path-based rewrite: /${siteName} -> ${url.pathname}`);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
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
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|ico|json)$).*)",
  ],
};
