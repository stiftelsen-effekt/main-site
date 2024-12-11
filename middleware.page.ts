// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export type ConsentState = "accepted" | "rejected" | "undecided";

export function middleware(request: NextRequest) {
  // Skip middleware for special paths
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/studio") ||
    request.nextUrl.pathname.startsWith("/favicon.ico") ||
    request.nextUrl.pathname.startsWith("/robots.txt") ||
    request.nextUrl.pathname.startsWith("/sitemap.xml") ||
    request.nextUrl.pathname.startsWith("/js/") ||
    request.nextUrl.pathname.startsWith("/proxy/")
  ) {
    return NextResponse.next();
  }

  const cookieConsent = request.cookies.get("gieffektivt-cookies-accepted")?.value;

  // Determine consent state
  let consentState: ConsentState = "undecided";
  if (cookieConsent === "true") consentState = "accepted";
  if (cookieConsent === "false") consentState = "rejected";

  // Clone URL and modify path
  const url = request.nextUrl.clone();
  // Add .page to match your pageExtensions config
  url.pathname = `/${consentState}${url.pathname}`;

  const response = NextResponse.rewrite(url);

  // Add ETag based on the cookie consent state
  // This way, the cache will only be invalidated when the consent state changes
  response.headers.set("ETag", `"consent-${consentState}"`);

  // Allow caching but require revalidation
  response.headers.set("Cache-Control", "private, must-revalidate");

  return response;
}
