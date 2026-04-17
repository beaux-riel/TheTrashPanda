"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AvailabilityFilter, PriceFilter, UserLocation } from "@/lib/discovery";

export function FilterPanel({
  categories,
  selectedCategories,
  radiusKm,
  availability,
  price,
  userLocation,
  locating,
  onToggleCategory,
  onRadiusChange,
  onAvailabilityChange,
  onPriceChange,
  onLocateUser
}: {
  categories: string[];
  selectedCategories: string[];
  radiusKm: number;
  availability: AvailabilityFilter;
  price: PriceFilter;
  userLocation: UserLocation | null;
  locating: boolean;
  onToggleCategory: (category: string) => void;
  onRadiusChange: (value: number) => void;
  onAvailabilityChange: (value: AvailabilityFilter) => void;
  onPriceChange: (value: PriceFilter) => void;
  onLocateUser: () => void;
}) {
  return (
    <Card className="space-y-5 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl text-[var(--ink)]">Filter the rummage</h3>
          <p className="text-sm text-[var(--ink-soft)]">Trim the feed without making it feel like tax software.</p>
        </div>
        <Button onClick={onLocateUser} variant="secondary">
          {locating ? "Checking location..." : userLocation ? "Refresh my spot" : "Use my location"}
        </Button>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">Categories</h4>
          {selectedCategories.length ? <Badge tone="gold">{selectedCategories.length} on</Badge> : null}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {categories.map((category) => {
            const checked = selectedCategories.includes(category);

            return (
              <label
                key={category}
                className="flex cursor-pointer items-center gap-3 rounded-[20px] border border-[color:var(--border)] bg-white/55 px-4 py-3 text-sm text-[var(--ink)]"
              >
                <input checked={checked} onChange={() => onToggleCategory(category)} type="checkbox" className="h-4 w-4 accent-[var(--accent)]" />
                <span>{category}</span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">Distance</h4>
          <Badge tone="forest">Within {radiusKm}km</Badge>
        </div>
        <input
          value={radiusKm}
          onChange={(event) => onRadiusChange(Number(event.target.value))}
          type="range"
          min={1}
          max={10}
          step={1}
          className="w-full accent-[var(--accent)]"
          aria-label="Filter by distance"
        />
      </section>

      <FilterRow
        label="Availability"
        options={[
          { label: "Available now", value: "available" },
          { label: "All", value: "all" }
        ]}
        value={availability}
        onChange={onAvailabilityChange}
      />

      <FilterRow
        label="Price"
        options={[
          { label: "Free only", value: "free" },
          { label: "Paid", value: "paid" },
          { label: "All", value: "all" }
        ]}
        value={price}
        onChange={onPriceChange}
      />
    </Card>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: Array<{ label: string; value: T }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <section className="space-y-3">
      <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">{label}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              value === option.value
                ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                : "border border-[color:var(--border)] bg-[var(--surface)] text-[var(--ink-soft)]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
