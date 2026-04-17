"use client";

import type { DiscoveryView } from "@/lib/discovery";

export function MapControls({
  categories,
  selectedCategories,
  radiusKm,
  view,
  onToggleCategory,
  onRadiusChange,
  onViewChange
}: {
  categories: string[];
  selectedCategories: string[];
  radiusKm: number;
  view: DiscoveryView;
  onToggleCategory: (category: string) => void;
  onRadiusChange: (value: number) => void;
  onViewChange: (value: DiscoveryView) => void;
}) {
  const radiusOptions = [1, 2, 5, 10];

  return (
    <div className="space-y-4 rounded-[30px] border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.76)] p-4 shadow-card backdrop-blur">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onToggleCategory("__all__")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
            selectedCategories.length === 0
              ? "bg-[var(--forest)] text-white"
              : "border border-[color:var(--border)] bg-[var(--surface)] text-[var(--ink-soft)]"
          }`}
        >
          All categories
        </button>
        {categories.map((category) => {
          const active = selectedCategories.includes(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => onToggleCategory(category)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                  : "border border-[color:var(--border)] bg-[var(--surface)] text-[var(--ink-soft)]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {radiusOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onRadiusChange(option)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                radiusKm === option
                  ? "bg-[var(--honey)] text-[var(--ink)]"
                  : "border border-[color:var(--border)] bg-[var(--surface)] text-[var(--ink-soft)]"
              }`}
            >
              {option}km
            </button>
          ))}
        </div>

        <div className="flex rounded-full border border-[color:var(--border)] bg-[var(--surface)] p-1">
          {(["map", "feed"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onViewChange(option)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                view === option ? "bg-[var(--accent)] text-[var(--accent-ink)]" : "text-[var(--ink-soft)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
