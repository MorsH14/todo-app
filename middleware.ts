import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware runs on the server, but we need to check client-side localStorage
// So we'll handle auth checks in the page components instead
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/todos/:path*", "/profile/:path*"],
}
