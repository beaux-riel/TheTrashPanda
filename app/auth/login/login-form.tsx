"use client";

import { useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; email: string } | { kind: "error"; message: string };

export function LoginForm({
  next,
  initialError
}: {
  next?: string;
  initialError?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>(
    initialError ? { kind: "error", message: decodeURIComponent(initialError) } : { kind: "idle" }
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setStatus({
        kind: "error",
        message: "Supabase isn't configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      });
      return;
    }

    setStatus({ kind: "sending" });

    const redirectParams = new URLSearchParams();
    if (next) redirectParams.set("next", next);
    const redirectSuffix = redirectParams.toString() ? `?${redirectParams.toString()}` : "";

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback${redirectSuffix}`
      }
    });

    if (error) {
      setStatus({ kind: "error", message: error.message });
      return;
    }

    setStatus({ kind: "sent", email: trimmed });
  }

  if (status.kind === "sent") {
    return (
      <div className="rounded-[24px] bg-[var(--surface)] p-5 text-sm leading-6 text-[var(--ink)]">
        <p className="font-semibold">Check {status.email}.</p>
        <p className="mt-1 text-[var(--ink-soft)]">
          The link lasts a little while. Click it from the same device you opened this tab on and
          Bandit will let you through the gate.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <label className="block text-sm font-semibold text-[var(--ink)]" htmlFor="email">
        Email
      </label>
      <input
        autoComplete="email"
        className="block w-full rounded-full border border-[color:var(--border)] bg-white px-4 py-3 text-base text-[var(--ink)] shadow-inner focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        id="email"
        inputMode="email"
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@powellriver.ca"
        required
        type="email"
        value={email}
      />
      <button
        className={buttonStyles("primary", "w-full")}
        disabled={status.kind === "sending"}
        type="submit"
      >
        {status.kind === "sending" ? "Sending magic link…" : "Send me a magic link"}
      </button>
      {status.kind === "error" ? (
        <p className="text-sm text-[var(--accent)]" role="alert">
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
