import { NextResponse } from 'next/server';

// Clerk middleware removed. No authentication middleware is now used.
// If you want to add custom middleware, do so here.

// No middleware is used. Export an empty function to satisfy Next.js requirements.
export function middleware() {
  // No-op
  return NextResponse.next();
}

export const config = {
  matcher: [], // No routes matched
};