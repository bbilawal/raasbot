import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const ADMIN_PATHS = ['/admin'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle admin auth
  if (ADMIN_PATHS.some(p => pathname.startsWith(p))) {
    const response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'editor'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!_next|api|.*\\..*).*)',
    '/(en|fr)/:path*',
  ]
};
