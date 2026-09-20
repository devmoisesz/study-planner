import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/constants';
import { isTokenActive } from '@/lib/auth/token';

const PUBLIC_ROUTES = new Set(['/login', '/cadastro']);

function withoutSession(response: NextResponse): NextResponse {
  response.cookies.delete(SESSION_COOKIE);
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authenticated = isTokenActive(token);

  if (pathname.startsWith('/api/')) {
    if (!authenticated) return withoutSession(NextResponse.next());

    const headers = new Headers(request.headers);
    headers.set('Authorization', `Bearer ${token}`);
    return NextResponse.next({ request: { headers } });
  }

  if (PUBLIC_ROUTES.has(pathname)) {
    if (authenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return token ? withoutSession(NextResponse.next()) : NextResponse.next();
  }

  if (!authenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return withoutSession(NextResponse.redirect(loginUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
