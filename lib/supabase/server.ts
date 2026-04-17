import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import type { Database } from "./types";

type ServerSupabase = SupabaseClient<Database>;

/**
 * Server component / route handler Supabase client.
 * Reads/writes the auth cookies created by the middleware.
 * Returns null when env vars are missing so the mock-data scaffold still works.
 */
export function createServerSupabaseClient(): ServerSupabase | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const cookieStore = cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // `cookies().set` throws in pure server components. Middleware keeps the
          // session fresh for us, so silently ignoring is safe here.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // See note above.
        }
      }
    }
  });
}

/**
 * Service-role client — bypasses RLS. Use ONLY in trusted server contexts
 * (route handlers, cron, background jobs). Never expose to the browser.
 */
export function createServiceSupabaseClient(): ServerSupabase | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  return createServerClient<Database>(url, serviceKey, {
    cookies: {
      get: () => undefined,
      set: () => {
        /* noop */
      },
      remove: () => {
        /* noop */
      }
    }
  });
}
