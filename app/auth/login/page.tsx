import type { Metadata } from "next";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to HarvestLink with a magic link. No passwords, just a friendly email."
};

export default function LoginPage({
  searchParams
}: {
  searchParams?: { next?: string; error?: string };
}) {
  const next = searchParams?.next;
  const error = searchParams?.error;

  return (
    <section className="mx-auto w-full max-w-lg py-10">
      <div className="space-y-4 rounded-[36px] border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.7)] p-8 shadow-card">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Bandit&apos;s porch light
          </p>
          <h1 className="font-display text-4xl leading-tight text-[var(--ink)]">
            Sign in with a magic link
          </h1>
          <p className="text-sm leading-6 text-[var(--ink-soft)]">
            Pop your email in below. We&apos;ll send a one-click link — no passwords to forget, no
            cartons to wash. Check spam if Bandit&apos;s napping on the mail truck.
          </p>
        </div>

        <LoginForm next={next} initialError={error} />

        <p className="pt-2 text-xs text-[var(--ink-soft)]">
          By signing in you agree to keep things neighbourly. HarvestLink only stores what it needs
          to help you post listings, follow producers, and catch fresh food nearby.
        </p>
      </div>
    </section>
  );
}
