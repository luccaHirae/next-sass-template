import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * Require a valid session in a Server Component or Layout.
 * If unauthenticated, redirects to the provided path (default: /login).
 */
export async function requireSession(redirectTo: string = '/login') {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(redirectTo);
  return session;
}

/**
 * Get the current session in a Server Component or Route Handler.
 * Returns null if unauthenticated.
 */
export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session ?? null;
}

/**
 * Use inside Route Handlers to guard APIs. Returns either a NextResponse (401)
 * when unauthenticated or the session when authorized.
 *
 * Usage:
 * const maybe = await apiAuthOr401();
 * if (maybe instanceof NextResponse) return maybe; // 401
 * const session = maybe; // authorized
 */
export async function apiAuthOr401(): Promise<
  | ReturnType<typeof NextResponse.json>
  | Awaited<ReturnType<typeof auth.api.getSession>>
> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session as any;
}
