import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ConsentState } from "./types/routing";

export default function proxy(request: NextRequest) {
  const cookieConsent = request.cookies.get("gieffektivt-cookies-accepted")?.value;

  // Determine consent state
  let consentState: ConsentState = "undecided";
  if (cookieConsent === "true") consentState = "accepted";
  if (cookieConsent === "false") consentState = "rejected";

  // Debug logging
  if (process.env.NODE_ENV === "development") {
    console.log(
      `[Proxy] ${request.method} ${request.nextUrl.pathname} -> consent: ${consentState}`,
    );
  }

  // Skip rewriting for static assets and special paths (but NOT _next/data)
  if (
    (request.nextUrl.pathname.startsWith("/_next") &&
      !request.nextUrl.pathname.startsWith("/_next/data")) ||
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

  // Handle _next/data requests (for client-side navigation)
  if (request.nextUrl.pathname.startsWith("/_next/data/")) {
    // Extract the route path from the data URL
    // Format: /_next/data/{buildId}/{route}.json
    const parts = request.nextUrl.pathname.split("/");
    const buildId = parts[3]; // Get the build ID
    const routeParts = parts.slice(4); // Get everything after build ID

    // If the route doesn't already start with a consent state, add it
    if (routeParts.length > 0 && !["accepted", "rejected", "undecided"].includes(routeParts[0])) {
      const url = request.nextUrl.clone();
      url.pathname = `/_next/data/${buildId}/${consentState}/${routeParts.join("/")}`;

      if (process.env.NODE_ENV === "development") {
        console.log(`[Proxy] Data rewrite: ${request.nextUrl.pathname} -> ${url.pathname}`);
      }

      const response = NextResponse.rewrite(url);
      response.headers.set("ETag", `"consent-${consentState}"`);
      response.headers.set("Cache-Control", "private, must-revalidate");
      return response;
    }

    return NextResponse.next();
  }

  // Handle regular page requests
  const url = request.nextUrl.clone();
  url.pathname = `/${consentState}${url.pathname}`;

  if (process.env.NODE_ENV === "development") {
    console.log(`[Proxy] Rewriting ${request.nextUrl.pathname} -> ${url.pathname}`);
  }

  const response = NextResponse.rewrite(url);

  // Add ETag based on the cookie consent state
  // This way, the cache will only be invalidated when the consent state changes
  response.headers.set("ETag", `"consent-${consentState}"`);

  // Allow caching but require revalidation
  response.headers.set("Cache-Control", "private, must-revalidate");

  return response;
}
