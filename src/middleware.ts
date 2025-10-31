import { type NextRequest, NextResponse } from "next/server";

// This middleware no longer logs.
// It just passes the request to the next step.
// All logging is now handled by _app.tsx.
// eslint-disable-next-line no-unused-vars
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}
// Keep the matcher to avoid running on static files
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|.well-known).*)",
  ],
};
