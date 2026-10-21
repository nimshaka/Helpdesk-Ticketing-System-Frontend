import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static / Next.js internal / asset files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/logo') ||
    pathname.startsWith('/auth/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('helpdesk_session')?.value;
  let sessionUser: { id: number; role: 'admin' | 'agent' | 'customer'; is_active: boolean } | null = null;

  if (sessionCookie) {
    try {
      sessionUser = JSON.parse(decodeURIComponent(sessionCookie));
    } catch {
      sessionUser = null;
    }
  }

  const isAuthRoute = pathname === '/login' || pathname === '/register' || pathname === '/auth';

  // 1. Unauthenticated users
  if (!sessionUser || !sessionUser.is_active) {
    // If trying to visit protected routes or root, redirect to /login
    if (
      pathname.startsWith('/customer') ||
      pathname.startsWith('/agent') ||
      pathname.startsWith('/admin') ||
      pathname === '/dashboard' ||
      pathname === '/'
    ) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // 2. Authenticated user visited /login, /register, or /auth -> redirect to role home
  const roleHome = `/${sessionUser.role}/dashboard`;
  if (isAuthRoute || pathname === '/' || pathname === '/dashboard') {
    return NextResponse.redirect(new URL(roleHome, request.url));
  }

  // 3. Role boundary protection
  if (pathname.startsWith('/customer') && sessionUser.role !== 'customer') {
    return NextResponse.redirect(new URL(roleHome, request.url));
  }

  if (pathname.startsWith('/agent') && sessionUser.role !== 'agent') {
    return NextResponse.redirect(new URL(roleHome, request.url));
  }

  if (pathname.startsWith('/admin') && sessionUser.role !== 'admin') {
    return NextResponse.redirect(new URL(roleHome, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
