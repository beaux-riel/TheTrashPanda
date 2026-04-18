"use client";

import { useCallback, useEffect, useState } from "react";

import type { FreshnessSummary } from "@/lib/types/contributions";
import { cn } from "@/lib/utils/cn";

type FreshnessWidgetProps = {
  listingId: string;
  variant?: "compact" | "full";
  initialSummary?: FreshnessSummary | null;
  className?: string;
};

type LocalState = {
  fresh: number;
  stale: number;
  viewerVote: boolean | null;
};

export function FreshnessWidget({
  listingId,
  variant = "full",
  initialSummary = null,
  className
}: FreshnessWidgetProps) {
  const [state, setState] = useState<LocalState>(() => ({
    fresh: initialSummary?.fresh_count ?? 0,
    stale: initialSummary?.stale_count ?? 0,
    viewerVote: initialSummary?.viewer_vote ?? null
  }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    try {
      const response = await fetch(`/api/freshness/${listingId}`, { method: "GET" });
      if (!response.ok) return;
      const body = (await response.json()) as { summary?: FreshnessSummary };
      if (body.summary) {
        setState({
          fresh: body.summary.fresh_count,
          stale: body.summary.stale_count,
          viewerVote: body.summary.viewer_vote
        });
      }
    } catch {
      // Silent — the widget degrades gracefully to its initial counts.
    }
  }, [listingId]);

  useEffect(() => {
    if (!initialSummary) {
      void loadSummary();
    }
  }, [initialSummary, loadSummary]);

  const vote = async (isFresh: boolean) => {
    if (busy) return;
    setBusy(true);
    setError(null);

    // Optimistic update
    setState((prev) => {
      const next = { ...prev };
      // Undo the previous vote's count.
      if (prev.viewerVote === true) next.fresh = Math.max(0, prev.fresh - 1);
      if (prev.viewerVote === false) next.stale = Math.max(0, prev.stale - 1);
      if (isFresh) next.fresh += 1;
      else next.stale += 1;
      next.viewerVote = isFresh;
      return next;
    });

    try {
      const response = await fetch("/api/freshness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, is_fresh: isFresh })
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Vote didn't stick.");
      }
      // Re-sync from the server to keep counts honest.
      void loadSummary();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Vote didn't stick.");
      // Roll back by re-loading.
      void loadSummary();
    } finally {
      setBusy(false);
    }
  };

  const votedFresh = state.viewerVote === true;
  const votedStale = state.viewerVote === false;

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2 text-xs", className)}>
        <VoteButton
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void vote(true);
          }}
          active={votedFresh}
          disabled={busy}
          compact
          label={`Still good ✓ (${state.fresh})`}
          tone="fresh"
        />
        <VoteButton
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void vote(false);
          }}
          active={votedStale}
          disabled={busy}
          compact
          label={`Maybe stale ? (${state.stale})`}
          tone="stale"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[24px] border border-[color:var(--border)] bg-[var(--surface)] p-4",
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-soft)]">
        Still accurate?
      </p>
      <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">
        Quick tap so the next neighbour knows what they&apos;re getting into.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <VoteButton
          onClick={() => void vote(true)}
          active={votedFresh}
          disabled={busy}
          label={`Still good ✓ (${state.fresh})`}
          tone="fresh"
        />
        <VoteButton
          onClick={() => void vote(false)}
          active={votedStale}
          disabled={busy}
          label={`Maybe stale ? (${state.stale})`}
          tone="stale"
        />
      </div>
      {error ? (
        <p className="mt-2 text-xs text-[color:rgba(217,79,48,0.95)]">{error}</p>
      ) : null}
    </div>
  );
}

function VoteButton({
  onClick,
  active,
  disabled,
  label,
  tone,
  compact = false
}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  active: boolean;
  disabled: boolean;
  label: string;
  tone: "fresh" | "stale";
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "rounded-full border font-semibold transition disabled:opacity-60",
        compact ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
        active && tone === "fresh" && "border-transparent bg-[var(--forest)] text-white",
        active && tone === "stale" && "border-transparent bg-[var(--accent)] text-[var(--accent-ink)]",
        !active && "border-[color:var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-strong)]"
      )}
    >
      {label}
    </button>
  );
}
