import {
  type NextRequest,
  type NextFetchEvent,
  NextResponse,
} from "next/server";

const LOGGING_URL = process.env.LOGGING_API_ENDPOINT;

export function middleware(request: NextRequest, event: NextFetchEvent) {
  // --- NEW CHECKS ---
  // 1. Get Next.js-specific headers
  const purpose = request.headers.get("Next-Purpose");
  const isPrefetch = request.headers.get("Next-Prefetch");

  // 2. Ignore prefetch requests explicitly (THIS IS THE FIX)
  if (isPrefetch) {
    return NextResponse.next();
  }

  // 3. Keep the old check for other non-page-load requests (like data)
  if (purpose && purpose !== "page-load") {
    return NextResponse.next();
  }
  // --- END NEW CHECKS ---

  if (LOGGING_URL) {
    const page = request.nextUrl.pathname;

    // Don't log the new API route
    if (page.startsWith("/api/log-visit")) {
      return NextResponse.next();
    }

    const visitorIp =
      request.ip || request.headers.get("x-forwarded-for") || "IP Not Found";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const logVisit = async () => {
      try {
        const urlToFetch = `${LOGGING_URL}?page=${encodeURIComponent(page)}`;

        const response = await fetch(urlToFetch, {
          method: "GET",
          headers: {
            "User-Agent": userAgent,
            "x-forwarded-for": visitorIp,
          },
          keepalive: true,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `[Middleware] Log server error: ${response.status}`,
            errorText,
          );
        }
      } catch (error) {
        console.error("[Middleware] Fetch failed:", error);
      }
    };

    event.waitUntil(logVisit());
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // This is the fix: added "_next/data" to the ignore list
    "/((?!api|_next/static|_next/image|_next/data|favicon.ico|images|.well-known).*)",
  ],
};
