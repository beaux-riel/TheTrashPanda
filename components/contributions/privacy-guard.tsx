"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils/cn";

type PrivacyGuardProps = {
  value: string;
  className?: string;
};

// Matches patterns like "1234 Main St", "42B Blueberry Ln", "Unit 3", "Apt #5".
const STREET_NUMBER = /\b\d{1,6}[A-Za-z]?\s+[A-Z][A-Za-z'-]+(?:\s+[A-Z][A-Za-z'-]+)*\s+(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Ln|Lane|Dr|Drive|Way|Crt|Court|Ct|Pl|Place|Hwy|Highway|Terrace|Cres|Crescent)\b/i;
const UNIT_MARKER = /\b(?:unit|apt|suite|ste|apartment)\s*#?\s*\d+[A-Za-z]?\b/i;
const BOX_MARKER = /\bpo\s*box\s*\d+\b/i;

export function looksLikeStreetAddress(text: string): boolean {
  if (!text) return false;
  return STREET_NUMBER.test(text) || UNIT_MARKER.test(text) || BOX_MARKER.test(text);
}

export function PrivacyGuard({ value, className }: PrivacyGuardProps) {
  const triggered = useMemo(() => looksLikeStreetAddress(value), [value]);

  if (!triggered) return null;

  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-2 rounded-[16px] border border-[color:rgba(217,139,43,0.45)] bg-[color:rgba(255,244,220,0.95)] px-3 py-2 text-xs leading-5 text-[color:rgba(120,70,10,0.95)]",
        className
      )}
    >
      <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>
        Heads up — we store locations at the neighbourhood level, not exact
        addresses. This keeps your neighbours safe.
      </span>
    </div>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01" />
      <path d="M11 12h1v4h1" />
    </svg>
  );
}
