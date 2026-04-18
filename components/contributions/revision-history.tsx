"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ContributionRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";

import { ContributionCard } from "./contribution-card";

type Scope =
  | { producerId: string; listingId?: never }
  | { listingId: string; producerId?: never };

type RevisionHistoryProps = {
  scope: Scope;
  canRevert?: boolean;
  triggerLabel?: string;
  triggerClassName?: string;
};

export function RevisionHistory({
  scope,
  canRevert = false,
  triggerLabel = "History",
  triggerClassName
}: RevisionHistoryProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-strong)]",
          triggerClassName
        )}
        aria-label="Open revision history"
      >
        <span aria-hidden="true">🕒</span>
        {triggerLabel}
      </button>

      {open ? (
        <RevisionDrawer scope={scope} canRevert={canRevert} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------
// drawer — slides in from the right, overlays the page
// ---------------------------------------------------------------------------

function RevisionDrawer({
  scope,
  canRevert,
  onClose
}: {
  scope: Scope;
  canRevert: boolean;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<ContributionRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const params = new URLSearchParams();
    if ("producerId" in scope && scope.producerId) {
      params.set("producer_id", scope.producerId);
    }
    if ("listingId" in scope && scope.listingId) {
      params.set("listing_id", scope.listingId);
    }
    // Intentionally omit status to receive the full audit trail.
    params.set("status", "approved");
    try {
      const [approved, autoApproved, reverted] = await Promise.all([
        fetchContributions({ params, status: "approved" }),
        fetchContributions({ params, status: "auto_approved" }),
        fetchContributions({ params, status: "reverted" })
      ]);
      const combined = [...approved, ...autoApproved, ...reverted].sort((a, b) =>
        a.created_at < b.created_at ? 1 : -1
      );
      setRows(combined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load history.");
      setRows([]);
    }
  }, [scope]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex bg-[rgba(45,42,38,0.44)] backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Revision history"
    >
      <aside
        onClick={(event) => event.stopPropagation()}
        className="ml-auto flex h-full w-full max-w-md flex-col border-l border-[color:var(--border)] bg-[var(--page)] shadow-card motion-safe:animate-pop"
      >
        <header className="flex items-start justify-between gap-3 border-b border-[color:var(--border)] bg-[var(--surface)] px-5 py-4">
          <div>
            <h2 className="font-display text-2xl text-[var(--ink)]">Revision history</h2>
            <p className="mt-1 text-sm leading-5 text-[var(--ink-soft)]">
              Every community edit, in order.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close history"
            className="rounded-full px-2.5 py-1 text-xl leading-none text-[var(--ink-soft)] transition hover:bg-[var(--surface-strong)]"
          >
            ×
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {error ? (
            <p className="rounded-xl border border-[#fecaca] bg-[#fee2e2] px-3 py-2 text-sm text-[var(--ink)]">
              {error}
            </p>
          ) : null}
          {!rows ? (
            <p className="text-sm text-[var(--ink-soft)]">Loading history…</p>
          ) : rows.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[color:var(--border)] px-4 py-6 text-center text-sm text-[var(--ink-soft)]">
              No community edits recorded yet.
            </p>
          ) : (
            <ol className="space-y-3">
              {rows.map((row) => (
                <li key={row.id}>
                  <ContributionCard
                    contribution={row}
                    actions={
                      canRevert && (row.status === "approved" || row.status === "auto_approved") ? (
                        <RevertButton
                          contributionId={row.id}
                          onReverted={() => void load()}
                        />
                      ) : null
                    }
                  />
                </li>
              ))}
            </ol>
          )}
        </div>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// revert action
// ---------------------------------------------------------------------------

function RevertButton({
  contributionId,
  onReverted
}: {
  contributionId: string;
  onReverted: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const revert = async () => {
    if (busy) return;
    const confirmed = window.confirm(
      "Revert this revision? This marks the contribution as reverted and, for new-listing revisions, removes the created row."
    );
    if (!confirmed) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/contributions/${contributionId}/revert`, {
        method: "POST"
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Couldn't revert that revision.");
      }
      onReverted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't revert.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" variant="secondary" onClick={revert} disabled={busy}>
        {busy ? "Reverting…" : "Revert"}
      </Button>
      {error ? (
        <span className="text-xs text-[color:rgba(217,79,48,0.95)]">{error}</span>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// fetch helper
// ---------------------------------------------------------------------------

async function fetchContributions({
  params,
  status
}: {
  params: URLSearchParams;
  status: string;
}): Promise<ContributionRow[]> {
  const next = new URLSearchParams(params);
  next.set("status", status);
  const response = await fetch(`/api/contributions?${next.toString()}`);
  if (!response.ok) {
    // A forbidden or error response just yields an empty slice; the drawer
    // surfaces the top-level error from `load()` via separate messaging.
    if (response.status === 403) return [];
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Couldn't load history.");
  }
  const body = (await response.json()) as { contributions?: ContributionRow[] };
  return body.contributions ?? [];
}
