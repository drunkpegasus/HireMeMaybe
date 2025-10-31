import {
  type NextRequest,
  type NextFetchEvent,
  NextResponse,
} from "next/server";

const LOGGING_URL = process.env.LOGGING_API_ENDPOINT;

export function middleware(request: NextRequest, event: NextFetchEvent) {
  if (LOGGING_URL) {
    // We only log the root page, so we set 'page' to '/'
    const page = "/";

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
  // This matcher will ONLY run for the root page ('/')
  // It will ignore /about, /pictures, /_next/data, prefetches, etc.
  matcher: ["/"],
};
