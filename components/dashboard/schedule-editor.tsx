"use client";

import { Card } from "@/components/ui/card";
import { useHarvestLink } from "@/hooks/use-harvestlink";

export function ScheduleEditor() {
  const { schedule, updateSchedule } = useHarvestLink();

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-display text-3xl text-[var(--ink)]">Operating schedule</h2>
        <p className="text-sm text-[var(--ink-soft)]">Tell people when you&apos;re actually around so no one drives out during chicken bedtime.</p>
      </div>
      <div className="space-y-3">
        {schedule.map((slot) => (
          <div key={slot.day} className="grid gap-3 rounded-[24px] bg-[var(--surface-strong)] p-4 sm:grid-cols-[72px_1fr_auto] sm:items-center">
            <label className="font-semibold text-[var(--ink)]">{slot.day}</label>
            <input
              className="min-h-11 rounded-full border border-[color:var(--border)] bg-white px-4 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
              value={slot.label}
              onChange={(event) => updateSchedule(slot.day, event.target.value, slot.open)}
            />
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)]">
              <input
                type="checkbox"
                checked={slot.open}
                onChange={(event) => updateSchedule(slot.day, slot.label, event.target.checked)}
              />
              Open
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
}
