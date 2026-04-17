"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./types";

type BrowserSupabase = SupabaseClient<Database>;

let cached: BrowserSupabase | null = null;

/**
 * Returns a browser Supabase client that keeps its session in cookies readable
 * by Next.js server components and route handlers. Returns null when env vars
 * aren't wired up yet so the mock-data scaffold keeps rendering.
 */
export function createBrowserSupabaseClient(): BrowserSupabase | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (cached) {
    return cached;
  }

  cached = createBrowserClient<Database>(url, anonKey);
  return cached;
}
