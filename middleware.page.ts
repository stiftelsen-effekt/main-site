// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export type ConsentState = "accepted" | "rejected" | "undecided";

export function middleware(request: NextRequest) {
  // Skip middleware for special paths
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.includes(".") ||
    request.nextUrl.pathname.startsWith("/consent-")
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

  return NextResponse.rewrite(url);
}
