import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Define paths that are considered authentication-related
const AUTH_PATHS = ['/login', '/register', '/verify']; // Add /verify or other auth flow paths
// Define paths that require authentication
// All paths NOT in AUTH_PATHS and not '/' (if public) could be considered protected by default
// or you can explicitly list them or use a pattern.

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ // Initialize response to allow cookie setting
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request and response cookies
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request and response cookies
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // IMPORTANT: Avoid calling supabase.auth.getUser() in middleware directly.
  // Instead, use getSession() to refresh the session if needed.
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Log middleware execution details
  console.log('Middleware Details:', {
    pathname,
    hasSession: !!session,
    isAuthPath: AUTH_PATHS.includes(pathname),
  });

  if (session) {
    // User is authenticated
    if (AUTH_PATHS.includes(pathname)) {
      // If on an auth path, redirect to /menu
      console.log('Redirecting authenticated user from auth path to /menu');
      return NextResponse.redirect(new URL('/menu', request.url));
    }
    // If on any other path, allow access (response is already NextResponse.next())
  } else {
    // User is not authenticated
    if (AUTH_PATHS.includes(pathname) || pathname === '/') {
      // Allow access to auth paths and the public root path '/'
      // (response is already NextResponse.next())
    } else {
      // If on a protected path, redirect to /login
      console.log('Redirecting unauthenticated user to /login from:', pathname);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return response; // Return the potentially modified response with updated cookies
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - health (health check endpoint, if you have one)
     * - monitoring (monitoring endpoint, if you have one)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|health|monitoring).*) ',
    // Explicitly include paths if needed, but the above regex is quite comprehensive
    // '/', // Included by the regex above
    // '/login', // Included by the regex above
    // '/register', // Included by the regex above
    // '/menu/:path*', // Included by the regex above
    // '/categories/:path*', // Included by the regex above
    // '/sub-categories/:path*', // Included by the regex above
    // '/products/:path*', // Included by the regex above
    // '/offers/:path*', // Included by the regex above
  ],
};
