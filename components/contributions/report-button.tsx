"use client";

import { useEffect, useRef, useState } from "react";

import type { ReportTargetType } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";

type ReportButtonProps = {
  targetType: ReportTargetType;
  targetId: string;
  className?: string;
  label?: string;
};

const REASONS: { value: string; label: string; needsDetail?: boolean }[] = [
  { value: "inaccurate", label: "Inaccurate information" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "spam", label: "Spam or fake" },
  { value: "does_not_exist", label: "This place does not exist" },
  { value: "other", label: "Other", needsDetail: true }
];

export function ReportButton({
  targetType,
  targetId,
  className,
  label = "Report"
}: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [detail, setDetail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reported, setReported] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = REASONS.find((r) => r.value === reason) ?? null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected) {
      setError("Pick a reason.");
      return;
    }
    const reasonText = selected.needsDetail
      ? detail.trim() || selected.label
      : selected.label;

    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          reason: reasonText
        })
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Couldn't file that report.");
      }
      setReported(true);
      window.setTimeout(() => setOpen(false), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't file that report.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => !reported && setOpen((o) => !o)}
        disabled={reported}
        aria-label={reported ? "Reported" : label}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-xs font-medium transition",
          reported
            ? "cursor-default bg-[var(--surface-strong)] text-[var(--ink-soft)]"
            : "text-[var(--ink-soft)] hover:border-[color:var(--border)] hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]"
        )}
      >
        <FlagIcon className="h-3.5 w-3.5" />
        {reported ? "Reported" : label}
      </button>

      {open && !reported ? (
        <div
          role="dialog"
          aria-label="Report this"
          className="absolute right-0 top-[calc(100%+6px)] z-40 w-72 rounded-[20px] border border-[color:var(--border)] bg-white p-4 shadow-card"
        >
          {reported ? (
            <p className="text-sm leading-6 text-[var(--ink)]">
              Thanks for the heads up. We will look into it. 🦝
            </p>
          ) : (
            <form className="space-y-3" onSubmit={submit}>
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">What is wrong?</p>
                <p className="text-xs leading-5 text-[var(--ink-soft)]">
                  Reports stay private — we will take a look.
                </p>
              </div>
              <div className="space-y-1.5">
                {REASONS.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-[14px] border border-transparent px-2 py-1.5 text-sm text-[var(--ink)] transition hover:bg-[var(--surface-strong)]",
                      reason === option.value && "border-[color:var(--border)] bg-[var(--surface-strong)]"
                    )}
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={option.value}
                      checked={reason === option.value}
                      onChange={() => setReason(option.value)}
                      className="mt-1 accent-[var(--accent)]"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>

              {selected?.needsDetail ? (
                <textarea
                  value={detail}
                  onChange={(event) => setDetail(event.target.value)}
                  rows={2}
                  placeholder="What's going on?"
                  className="w-full rounded-[14px] border border-[color:var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus-visible:border-[var(--accent)]"
                />
              ) : null}

              {error ? (
                <p className="text-xs text-[color:rgba(217,79,48,0.95)]">{error}</p>
              ) : null}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)]"
                  disabled={busy}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy || !selected}
                  className="rounded-full bg-[var(--ink)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {busy ? "Sending…" : "Send report"}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : null}

      {reported && open ? (
        <div
          role="status"
          className="absolute right-0 top-[calc(100%+6px)] z-40 w-64 rounded-[20px] border border-[color:var(--border)] bg-white p-3 text-sm text-[var(--ink)] shadow-card"
        >
          Thanks for the heads up. We will look into it. 🦝
        </div>
      ) : null}
    </div>
  );
}

function FlagIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 22V4" />
      <path d="M4 4h12l-2 4 2 4H4" />
    </svg>
  );
}
