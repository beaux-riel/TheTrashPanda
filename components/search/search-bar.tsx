"use client";

import { useEffect, useState } from "react";

import { BanditIllustration } from "@/components/brand/bandit-illustration";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function SearchBar({
  initialValue = "",
  onSearch,
  resultCount
}: {
  initialValue?: string;
  onSearch: (value: string) => void;
  resultCount: number;
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [onSearch, value]);

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3 rounded-[28px] border border-[color:var(--border)] bg-[var(--surface)] px-4 py-3 shadow-card">
        <SearchIcon />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search eggs, producers, bread drama..."
          className="w-full border-none bg-transparent text-base text-[var(--ink)] outline-none placeholder:text-[var(--ink-soft)]"
          type="search"
          aria-label="Search HarvestLink listings"
        />
        <Badge tone={resultCount ? "forest" : "neutral"}>{resultCount} match{resultCount === 1 ? "" : "es"}</Badge>
      </label>
      {value.trim() && resultCount === 0 ? (
        <Card className="relative overflow-hidden px-5 py-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--honey),var(--accent),var(--forest))]" />
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="relative">
              <BanditIllustration variant="empty" className="max-w-[128px]" />
              <div className="absolute -right-1 top-1 rounded-full bg-[var(--surface)] p-2 shadow-card">
                <SearchIcon className="h-5 w-5 text-[var(--accent)]" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-2xl text-[var(--ink)]">Nobody&apos;s listed that yet</h3>
              <p className="max-w-xl text-sm leading-6 text-[var(--ink-soft)]">
                Nothing nearby? Either everyone&apos;s gardening or it&apos;s raining. (It&apos;s probably raining.)
              </p>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function SearchIcon({ className = "h-5 w-5 text-[var(--ink-soft)]" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M21 21L16.65 16.65M19 10.5A8.5 8.5 0 1 1 2 10.5a8.5 8.5 0 0 1 17 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
