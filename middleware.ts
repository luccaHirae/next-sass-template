import { NextRequest, NextResponse } from 'next/server';
import { getCookieCache } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const session = await getCookieCache(request);

  if (!session) {
    const next = encodeURIComponent(
      request.nextUrl.pathname + (request.nextUrl.search || '')
    );
    const loginUrl = new URL(`/login?next=${next}`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Apply to protected routes; expand as needed
  matcher: ['/settings/:path*', '/home/:path*'],
};
