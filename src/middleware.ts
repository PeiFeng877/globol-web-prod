/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: NextRequest
 * OUTPUT: NextResponse
 * POS: Edge Middleware
 * CONTRACT: Enforces locale prefixes and rewrites paths.
 * 职责: 全站语言前缀路由守卫。
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, locales } from '@/i18n/settings';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files, API routes, admin routes, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/assets') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already has a locale prefix
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  const activeLocale = pathnameLocale ?? defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', activeLocale);

  if (pathnameLocale) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Rewrite default locale (en) paths to /en/...
  request.nextUrl.pathname = `/${activeLocale}${pathname}`;

  return NextResponse.rewrite(request.nextUrl, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/_vercel` or `/admin`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|admin|.*\\..*).*)',
  ],
};
