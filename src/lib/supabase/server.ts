import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() { // Made async
  const cookieStore = await cookies(); // Await cookies() if it's a Promise

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // After await, cookieStore should be ReadonlyRequestCookies
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // Type assertion to handle ReadonlyRequestCookies for TypeScript
            // At runtime, this works in Server Actions/Route Handlers
            (cookieStore as any).set(name, value, options);
          } catch (error) {
            // Errors can occur if called from a Server Component, which is read-only.
            // Supabase docs suggest this can be ignored if middleware handles session refresh.
            // console.warn(`Failed to set cookie '${name}' from Server Component/Context. Error: ${error}`);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // Type assertion and use set with empty value for removal
            (cookieStore as any).set(name, '', options);
          } catch (error) {
            // Errors can occur if called from a Server Component.
            // console.warn(`Failed to remove cookie '${name}' from Server Component/Context. Error: ${error}`);
          }
        },
      },
    }
  );
}
