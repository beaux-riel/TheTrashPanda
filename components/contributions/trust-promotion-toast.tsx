"use client";

import { useEffect, useState } from "react";

import type { TrustTier } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";

type TrustPromotionToastProps = {
  tier: TrustTier;
  show: boolean;
  onDismiss?: () => void;
  className?: string;
  durationMs?: number;
};

const COPY: Record<TrustTier, { title: string; body: string } | null> = {
  new: null,
  trusted: {
    title: "You did it!",
    body: "You are now a Trusted contributor. Your edits go live instantly. 🌟"
  },
  verified: {
    title: "Welcome home!",
    body: "This profile is yours now. 🦝"
  }
};

export function TrustPromotionToast({
  tier,
  show,
  onDismiss,
  className,
  durationMs = 5000
}: TrustPromotionToastProps) {
  const [visible, setVisible] = useState(show);
  const [entered, setEntered] = useState(false);
  const copy = COPY[tier];

  useEffect(() => {
    if (!show || !copy) {
      setVisible(false);
      setEntered(false);
      return;
    }
    setVisible(true);
    const enterTimer = setTimeout(() => setEntered(true), 20);
    const exitTimer = setTimeout(() => {
      setEntered(false);
      setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, 280);
    }, durationMs);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [show, copy, durationMs, onDismiss]);

  if (!visible || !copy) return null;

  const toneBg = tier === "verified" ? "bg-[var(--forest)]" : "bg-[var(--honey)]";
  const toneInk = tier === "verified" ? "text-white" : "text-[var(--ink)]";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-auto flex max-w-md items-start gap-3 rounded-xl px-4 py-3 shadow-lg transition-all duration-300",
          toneBg,
          toneInk,
          entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
      >
        <span aria-hidden="true" className="text-2xl">
          {tier === "verified" ? "🦝" : "🌟"}
        </span>
        <div className="flex-1">
          <p className="font-display text-lg leading-tight">{copy.title}</p>
          <p className="mt-0.5 text-sm leading-5 opacity-90">{copy.body}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEntered(false);
            setTimeout(() => {
              setVisible(false);
              onDismiss?.();
            }, 280);
          }}
          className="ml-1 text-sm font-semibold opacity-70 transition hover:opacity-100"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
