// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if the path is missing a locale
  const pathnameIsMissingLocale = ['/en', '/ar', '/tr'].every(
    (locale) => !pathname.startsWith(locale) && pathname !== locale
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Get the preferred locale from Accept-Language header or default to 'en'
    const locale = getLocale(request) ?? 'en';
    
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }
}

function getLocale(request: NextRequest): string {
  // Check if there's a preferred locale in cookies
  const localeCookie = request.cookies.get('locale')?.value;
  if (localeCookie && ['en', 'ar', 'tr'].includes(localeCookie)) {
    return localeCookie;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    // Simple locale detection - you can make this more sophisticated
    if (acceptLanguage.includes('ar')) return 'ar';
    if (acceptLanguage.includes('tr')) return 'tr';
  }
  
  return 'en'; // Default fallback
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};