"use client";

import { useEffect, useState } from "react";

import type { FreshnessSummary } from "@/lib/types/contributions";
import { cn } from "@/lib/utils/cn";

type FreshnessDotProps = {
  listingId: string;
  className?: string;
};

type Tone = "fresh" | "recent" | "stale" | "unknown";

type DotState = {
  tone: Tone;
  tooltip: string;
};

const TONE_CLASS: Record<Tone, string> = {
  fresh: "bg-[#22c55e]",
  recent: "bg-[#eab308]",
  stale: "bg-[#ef4444]",
  unknown: "bg-[#9ca3af]"
};

function relative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function summarise(summary: FreshnessSummary): DotState {
  if (summary.stale_count >= 3) {
    return { tone: "stale", tooltip: "Neighbours flagged this as possibly outdated" };
  }
  if (summary.last_confirmed_at) {
    const ageMs = Date.now() - new Date(summary.last_confirmed_at).getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;
    if (ageMs < oneDay) {
      return {
        tone: "fresh",
        tooltip: `Confirmed fresh ${relative(summary.last_confirmed_at)}`
      };
    }
    if (ageMs < sevenDays) {
      return {
        tone: "recent",
        tooltip: `Last checked ${relative(summary.last_confirmed_at)}`
      };
    }
  }
  return { tone: "unknown", tooltip: "No freshness reports yet" };
}

export function FreshnessDot({ listingId, className }: FreshnessDotProps) {
  const [state, setState] = useState<DotState>({ tone: "unknown", tooltip: "No freshness reports yet" });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(`/api/freshness/${listingId}`, { method: "GET" });
        if (!response.ok) return;
        const body = (await response.json()) as { summary?: FreshnessSummary };
        if (!cancelled && body.summary) {
          setState(summarise(body.summary));
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

  return (
    <span
      title={state.tooltip}
      aria-label={state.tooltip}
      className={cn(
        "inline-block h-2 w-2 rounded-full ring-2 ring-white/70",
        TONE_CLASS[state.tone],
        className
      )}
    />
  );
}
