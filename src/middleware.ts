// src/middleware.ts
import { type NextRequest, type NextFetchEvent, NextResponse } from 'next/server';

const LOGGING_URL = process.env.LOGGING_API_ENDPOINT;

export function middleware(request: NextRequest, event: NextFetchEvent) {
  // --- ADD THIS CHECK ---
  // Only log if it's a 'page-load' request.
  // This ignores data requests, prefetches, etc., solving the double-log.
  const purpose = request.headers.get('Next-Purpose');
  if (purpose && purpose !== 'page-load') {
    return NextResponse.next();
  }
  // --- END CHECK ---

  if (LOGGING_URL) {
    const page = request.nextUrl.pathname;
    
    // Don't log the new API route
    if (page.startsWith('/api/log-visit')) {
      return NextResponse.next();
    }

    const visitorIp = request.ip || request.headers.get('x-forwarded-for') || 'IP Not Found';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const logVisit = async () => {
      try {
        const urlToFetch = `${LOGGING_URL}?page=${encodeURIComponent(page)}`;

        const response = await fetch(urlToFetch, {
          method: 'GET',
          headers: {
            'User-Agent': userAgent,
            'x-forwarded-for': visitorIp,
          },
          keepalive: true,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[Middleware] Log server error: ${response.status}`, errorText);
        }
      } catch (error) {
        console.error('[Middleware] Fetch failed:', error);
      }
    };

    event.waitUntil(logVisit());
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|.well-known).*)',
  ],
};