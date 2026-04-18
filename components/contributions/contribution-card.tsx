"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ContributionRow } from "@/lib/supabase/types";
import type { ContributionPayload, TrustTier } from "@/lib/types/contributions";
import { cn } from "@/lib/utils/cn";

import { ContributionDiff } from "./contribution-diff";

type ContributionCardProps = {
  contribution: ContributionRow;
  contributorName?: string | null;
  contributorTrustTier?: TrustTier | null;
  actions?: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
};

export function ContributionCard({
  contribution,
  contributorName,
  contributorTrustTier,
  actions,
  defaultExpanded = false,
  className
}: ContributionCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const payload = contribution.payload as unknown as ContributionPayload;

  return (
    <Card className={cn("space-y-3 rounded-2xl p-4", className)}>
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-semibold text-[var(--ink)]">
              {contributorName ?? "A neighbour"}
            </span>
            {contributorTrustTier ? <TrustBadge tier={contributorTrustTier} /> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ink-soft)]">
            <TypeBadge type={contribution.type} />
            <StatusBadge status={contribution.status} />
            <time dateTime={contribution.created_at}>{timeAgo(contribution.created_at)}</time>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-strong)]"
        >
          {expanded ? "Hide details" : "Show details"}
        </button>
      </header>

      {expanded ? (
        <div className="rounded-2xl bg-[var(--surface-strong)] p-3">
          <ContributionDiff payload={payload} />
        </div>
      ) : null}

      {actions ? (
        <div className="flex flex-wrap items-center justify-end gap-2 pt-1">{actions}</div>
      ) : null}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// badges
// ---------------------------------------------------------------------------

type TypeKey = ContributionRow["type"];
type StatusKey = ContributionRow["status"];

const TYPE_LABELS: Record<TypeKey, string> = {
  profile_create: "New profile",
  profile_edit: "Profile edit",
  listing_create: "New listing",
  listing_edit: "Listing edit",
  availability_update: "Availability",
  flag_stale: "Flagged stale",
  confirm_fresh: "Confirmed fresh"
};

const TYPE_TONE: Record<TypeKey, string> = {
  profile_create: "bg-indigo-100 text-indigo-800",
  profile_edit: "bg-indigo-100 text-indigo-800",
  listing_create: "bg-emerald-100 text-emerald-800",
  listing_edit: "bg-emerald-100 text-emerald-800",
  availability_update: "bg-amber-100 text-amber-800",
  flag_stale: "bg-sky-100 text-sky-800",
  confirm_fresh: "bg-sky-100 text-sky-800"
};

function TypeBadge({ type }: { type: TypeKey }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        TYPE_TONE[type]
      )}
    >
      {TYPE_LABELS[type]}
    </span>
  );
}

const STATUS_LABELS: Record<StatusKey, string> = {
  pending: "Pending",
  approved: "Approved",
  auto_approved: "Auto-approved",
  rejected: "Rejected",
  reverted: "Reverted"
};

const STATUS_TONE: Record<StatusKey, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  auto_approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  reverted: "bg-gray-200 text-gray-700"
};

export function StatusBadge({ status }: { status: StatusKey }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        STATUS_TONE[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function TrustBadge({ tier }: { tier: TrustTier }) {
  if (tier === "new") {
    return (
      <Badge tone="neutral" className="text-[10px]">
        New neighbour
      </Badge>
    );
  }
  if (tier === "trusted") {
    return (
      <Badge tone="forest" className="text-[10px]">
        Trusted
      </Badge>
    );
  }
  return (
    <Badge tone="gold" className="text-[10px]">
      Verified
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// time helper — light client-side formatter so we don't pull a dependency
// ---------------------------------------------------------------------------

export function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "just now";
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}
