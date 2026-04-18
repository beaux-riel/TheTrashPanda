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
  lastConfirmedAt: string | null;
};

function relativeTime(iso: string | null): string {
  if (!iso) return "";
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 0) return "just now";
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

export function FreshnessWidget({
  listingId,
  variant = "full",
  initialSummary = null,
  className
}: FreshnessWidgetProps) {
  const [state, setState] = useState<LocalState>(() => ({
    fresh: initialSummary?.fresh_count ?? 0,
    stale: initialSummary?.stale_count ?? 0,
    viewerVote: initialSummary?.viewer_vote ?? null,
    lastConfirmedAt: initialSummary?.last_confirmed_at ?? null
  }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState<number>(0);
  const [pulseKind, setPulseKind] = useState<"fresh" | "stale" | null>(null);

  const loadSummary = useCallback(async () => {
    try {
      const response = await fetch(`/api/freshness/${listingId}`, { method: "GET" });
      if (!response.ok) return;
      const body = (await response.json()) as { summary?: FreshnessSummary };
      if (body.summary) {
        setState({
          fresh: body.summary.fresh_count,
          stale: body.summary.stale_count,
          viewerVote: body.summary.viewer_vote,
          lastConfirmedAt: body.summary.last_confirmed_at
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

    setPulseKind(isFresh ? "fresh" : "stale");
    setPulseKey((k) => k + 1);

    // Optimistic update
    setState((prev) => {
      const next = { ...prev };
      if (prev.viewerVote === true) next.fresh = Math.max(0, prev.fresh - 1);
      if (prev.viewerVote === false) next.stale = Math.max(0, prev.stale - 1);
      if (isFresh) {
        next.fresh += 1;
        next.lastConfirmedAt = new Date().toISOString();
      } else {
        next.stale += 1;
      }
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
      void loadSummary();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Vote didn't stick.");
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
          pulseKey={pulseKind === "fresh" ? pulseKey : 0}
          pulseKind="fresh"
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
          pulseKey={pulseKind === "stale" ? pulseKey : 0}
          pulseKind="stale"
          label={`Maybe stale ? (${state.stale})`}
          tone="stale"
        />
      </div>
    );
  }

  const timestampText = state.lastConfirmedAt
    ? `Confirmed fresh ${relativeTime(state.lastConfirmedAt)}`
    : state.fresh + state.stale === 0
      ? "No reports yet"
      : state.stale > 0
        ? `Last flagged ${state.stale} time${state.stale === 1 ? "" : "s"}`
        : "No reports yet";

  const showStaleWarning = state.stale >= 3;

  return (
    <div
      className={cn(
        "rounded-[24px] border border-[color:var(--border)] bg-[var(--surface)] p-4",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-soft)]">
          Still accurate?
        </p>
        <p className="text-xs text-[var(--ink-soft)]">{timestampText}</p>
      </div>
      <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">
        Quick tap so the next neighbour knows what they&apos;re getting into.
      </p>

      {showStaleWarning ? (
        <div
          className="mt-3 rounded-[18px] border border-[rgba(218,165,32,0.35)] bg-[rgba(218,165,32,0.14)] px-3 py-2 text-xs font-medium text-[var(--ink)]"
          role="status"
        >
          <span aria-hidden="true" className="mr-1.5">⚠️</span>
          Heads up — a few neighbours flagged this as possibly outdated.
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <VoteButton
          onClick={() => void vote(true)}
          active={votedFresh}
          disabled={busy}
          pulseKey={pulseKind === "fresh" ? pulseKey : 0}
          pulseKind="fresh"
          label={`Still good ✓ (${state.fresh})`}
          tone="fresh"
        />
        <VoteButton
          onClick={() => void vote(false)}
          active={votedStale}
          disabled={busy}
          pulseKey={pulseKind === "stale" ? pulseKey : 0}
          pulseKind="stale"
          label={`Maybe stale ? (${state.stale})`}
          tone="stale"
        />
      </div>
      {error ? (
        <p className="mt-2 text-xs text-[color:rgba(217,79,48,0.95)]">{error}</p>
      ) : null}
      <style jsx>{`
        @keyframes freshness-pop {
          0% { transform: scale(1); }
          40% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        @keyframes freshness-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          50% { transform: translateX(3px); }
          75% { transform: translateX(-2px); }
        }
      `}</style>
    </div>
  );
}

function VoteButton({
  onClick,
  active,
  disabled,
  label,
  tone,
  compact = false,
  pulseKey = 0,
  pulseKind
}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  active: boolean;
  disabled: boolean;
  label: string;
  tone: "fresh" | "stale";
  compact?: boolean;
  pulseKey?: number;
  pulseKind?: "fresh" | "stale";
}) {
  const shouldAnimate = pulseKey > 0 && pulseKind === tone;
  const animationName = tone === "fresh" ? "freshness-pop" : "freshness-shake";

  return (
    <button
      key={`${tone}-${pulseKey}`}
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
      style={
        shouldAnimate
          ? { animation: `${animationName} 0.35s ease-out` }
          : undefined
      }
    >
      {label}
    </button>
  );
}
