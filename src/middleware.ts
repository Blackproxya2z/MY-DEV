import { NextRequest, NextResponse } from 'next/server';

/**
 * Production Edge Middleware (Cloudflare + Vercel Hardened)
 * 1. CSRF Origin / Host verification for all state-changing API requests (POST/PUT/DELETE/PATCH)
 * 2. Strict HTTP Security Headers (HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Frame-Options)
 * 3. Search Engine Isolation (X-Robots-Tag: noindex, nofollow on /admin/* and /api/*)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // 1. CSRF Protection for mutating API calls
  if (
    pathname.startsWith('/api/') &&
    ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)
  ) {
    const origin = request.headers.get('origin');
    const host =
      request.headers.get('x-forwarded-host') || request.headers.get('host');

    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return NextResponse.json(
            {
              success: false,
              error: 'CSRF_ORIGIN_MISMATCH: Cross-origin state mutation blocked.',
            },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { success: false, error: 'INVALID_ORIGIN_HEADER' },
          { status: 403 }
        );
      }
    }
  }

  const response = NextResponse.next();

  // 2. Production Security Headers (Cloudflare + Vercel + Firebase Safe)
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://challenges.cloudflare.com https://*.googleapis.com https://*.firebaseio.com https://*.firebasestorage.app https://*.supabase.co https://vitals.vercel-insights.com",
    "frame-src 'self' https://challenges.cloudflare.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspDirectives);
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()'
  );

  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('Cache-Control', 'no-store, max-age=0');
  } else {
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)',
  ],
};

