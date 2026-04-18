"use client";

import { useEffect, useState } from "react";

import type { FreshnessSummary } from "@/lib/types/contributions";
import { cn } from "@/lib/utils/cn";

type StaleBannerProps = {
  listingId: string;
  initialStaleCount?: number;
  className?: string;
};

type Status = "idle" | "confirmed_fresh" | "confirmed_gone" | "error";

export function StaleBanner({ listingId, initialStaleCount = 0, className }: StaleBannerProps) {
  const [staleCount, setStaleCount] = useState(initialStaleCount);
  const [status, setStatus] = useState<Status>("idle");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(`/api/freshness/${listingId}`, { method: "GET" });
        if (!response.ok) return;
        const body = (await response.json()) as { summary?: FreshnessSummary };
        if (!cancelled && body.summary) {
          setStaleCount(body.summary.stale_count);
        }
      } catch {
        // silent
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  if (staleCount < 3 && status === "idle") {
    return null;
  }

  async function respond(isFresh: boolean) {
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/freshness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, is_fresh: isFresh })
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Couldn't record your response.");
      }
      const body = (await response.json().catch(() => null)) as { staleFlagCount?: number | null } | null;
      if (isFresh) {
        setStatus("confirmed_fresh");
        setStaleCount(body?.staleFlagCount ?? 0);
      } else {
        setStatus("confirmed_gone");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't record your response.");
      setStatus("error");
    } finally {
      setBusy(false);
    }
  }

  if (status === "confirmed_fresh") {
    return (
      <div
        className={cn(
          "rounded-[24px] border border-[rgba(58,90,64,0.24)] bg-[rgba(58,90,64,0.1)] p-4 text-sm text-[var(--forest)]",
          className
        )}
      >
        <span aria-hidden="true" className="mr-1.5">✓</span>
        Thanks for checking — we&apos;ll let everyone know it&apos;s still available.
      </div>
    );
  }

  if (status === "confirmed_gone") {
    return (
      <div
        className={cn(
          "rounded-[24px] border border-[color:var(--border)] bg-[var(--surface-strong)] p-4 text-sm text-[var(--ink-soft)]",
          className
        )}
      >
        Got it — marking this as no longer available.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[24px] border border-[rgba(218,165,32,0.35)] bg-[rgba(218,165,32,0.16)] p-4",
        className
      )}
      role="status"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-[200px]">
          <p className="font-display text-xl text-[var(--ink)]">
            <span aria-hidden="true" className="mr-1.5">⚠️</span>
            This listing might be outdated
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">
            Can you confirm it is still available? {staleCount} neighbour{staleCount === 1 ? " has" : "s have"} flagged
            it recently.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void respond(true)}
            disabled={busy}
            className="rounded-full bg-[var(--forest)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            Still available ✓
          </button>
          <button
            type="button"
            onClick={() => void respond(false)}
            disabled={busy}
            className="rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-strong)] disabled:opacity-60"
          >
            No longer available ✗
          </button>
        </div>
      </div>
      {error ? (
        <p className="mt-2 text-xs text-[color:rgba(217,79,48,0.95)]">{error}</p>
      ) : null}
    </div>
  );
}
