"use client";

import { BanditIllustration } from "@/components/brand/bandit-illustration";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-[70vh] place-items-center py-12">
      <div className="max-w-xl space-y-5 text-center">
        <div className="mx-auto max-w-[220px]">
          <BanditIllustration variant="error" priority />
        </div>
        <h1 className="font-display text-5xl text-[var(--ink)]">Something went sideways.</h1>
        <p className="text-lg leading-8 text-[var(--ink-soft)]">
          Bandit probably broke it. We&apos;re fixing it. Give the page another poke and let&apos;s pretend this never happened.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
