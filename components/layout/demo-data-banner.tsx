"use client";

import Link from "next/link";

function isSupabaseConfiguredClient() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function DemoDataBanner() {
  if (isSupabaseConfiguredClient()) return null;

  return (
    <aside
      role="status"
      className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-[20px] border border-[color:rgba(218,165,32,0.45)] bg-[color:rgba(218,165,32,0.14)] px-4 py-3 text-sm text-[var(--ink)]"
    >
      <p className="flex items-center gap-2">
        <span aria-hidden></span>
        <span>Showing demo data — sign in to see the real stuff.</span>
      </p>
      <Link
        href="/auth/login"
        className="rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-3 py-1 font-semibold text-[var(--ink)] hover:bg-[var(--surface-strong)]"
      >
        Sign in
      </Link>
    </aside>
  );
}
