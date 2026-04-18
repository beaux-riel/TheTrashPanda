"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ContributionCard } from "@/components/contributions/contribution-card";
import { Button } from "@/components/ui/button";
import type { ContributionRow, ContributionType } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";

type TabKey = "all" | "profiles" | "listings" | "availability";

const TAB_LABELS: Record<TabKey, string> = {
  all: "All",
  profiles: "Profiles",
  listings: "Listings",
  availability: "Availability"
};

const TAB_TYPES: Record<TabKey, ContributionType[] | null> = {
  all: null,
  profiles: ["profile_create", "profile_edit"],
  listings: ["listing_create", "listing_edit"],
  availability: ["availability_update", "flag_stale", "confirm_fresh"]
};

export function ReviewQueue() {
  const [tab, setTab] = useState<TabKey>("all");
  const [rows, setRows] = useState<ContributionRow[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mutating, setMutating] = useState<Record<string, "approve" | "reject" | null>>({});
  const [mutationError, setMutationError] = useState<Record<string, string | null>>({});

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch("/api/contributions?status=pending");
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(
          response.status === 403
            ? "You need Trusted status to review contributions."
            : body?.error ?? "Couldn't load the queue."
        );
      }
      const body = (await response.json()) as { contributions?: ContributionRow[] };
      setRows((body.contributions ?? []).slice().sort((a, b) => (a.created_at < b.created_at ? 1 : -1)));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Couldn't load the queue.");
      setRows([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!rows) return null;
    const types = TAB_TYPES[tab];
    if (!types) return rows;
    return rows.filter((row) => types.includes(row.type));
  }, [rows, tab]);

  const act = async (id: string, action: "approve" | "reject") => {
    setMutating((prev) => ({ ...prev, [id]: action }));
    setMutationError((prev) => ({ ...prev, [id]: null }));
    try {
      const response = await fetch(`/api/contributions/${id}/${action}`, { method: "POST" });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `Couldn't ${action}.`);
      }
      setRows((prev) => (prev ? prev.filter((row) => row.id !== id) : prev));
    } catch (err) {
      setMutationError((prev) => ({
        ...prev,
        [id]: err instanceof Error ? err.message : `Couldn't ${action}.`
      }));
    } finally {
      setMutating((prev) => ({ ...prev, [id]: null }));
    }
  };

  return (
    <div className="space-y-4">
      <TabBar tab={tab} onChange={setTab} />

      {loadError ? (
        <p className="rounded-2xl border border-[#fecaca] bg-[#fee2e2] px-4 py-3 text-sm text-[var(--ink)]">
          {loadError}
        </p>
      ) : null}

      {!filtered ? (
        <p className="text-sm text-[var(--ink-soft)]">Loading the queue…</p>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {filtered.map((row) => (
            <li key={row.id}>
              <ContributionCard
                contribution={row}
                defaultExpanded={false}
                actions={
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => void act(row.id, "reject")}
                        disabled={Boolean(mutating[row.id])}
                      >
                        {mutating[row.id] === "reject" ? "Rejecting…" : "Reject"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => void act(row.id, "approve")}
                        disabled={Boolean(mutating[row.id])}
                      >
                        {mutating[row.id] === "approve" ? "Approving…" : "Approve"}
                      </Button>
                    </div>
                    {mutationError[row.id] ? (
                      <span className="text-xs text-[color:rgba(217,79,48,0.95)]">
                        {mutationError[row.id]}
                      </span>
                    ) : null}
                  </div>
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TabBar({ tab, onChange }: { tab: TabKey; onChange: (next: TabKey) => void }) {
  const tabs = Object.keys(TAB_LABELS) as TabKey[];
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((key) => {
        const active = key === tab;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              active
                ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                : "border border-[color:var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-strong)]"
            )}
          >
            {TAB_LABELS[key]}
          </button>
        );
      })}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[28px] border border-dashed border-[color:var(--border)] bg-[var(--surface)] px-6 py-10 text-center">
      <p className="font-display text-2xl text-[var(--ink)]">Nothing to review right now.</p>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">
        The neighbours are keeping things tidy. 🦝
      </p>
    </div>
  );
}
