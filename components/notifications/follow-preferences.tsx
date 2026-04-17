"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useHarvestLink } from "@/hooks/use-harvestlink";
import type { NotificationFrequency } from "@/lib/data/mock";

const frequencies: NotificationFrequency[] = ["immediate", "daily", "off"];

export function FollowPreferences() {
  const { follows, updateFollowPreference, toggleMuteFollow } = useHarvestLink();

  return (
    <div className="space-y-4">
      {follows.map((follow) => (
        <Card key={follow.id} className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-2xl text-[var(--ink)]">{follow.label}</h3>
                <Badge tone={follow.muted ? "neutral" : "forest"}>{follow.muted ? "Muted" : "Live"}</Badge>
              </div>
              <p className="text-sm text-[var(--ink-soft)]">
                {follow.type === "producer" && "Producer follow. Good for catching fresh posts without camping the feed."}
                {follow.type === "category" && "Category watch. Handy when you always need the same thing."}
                {follow.type === "area" &&
                  `${follow.areaLabel} radius${follow.radiusKm ? ` · ${follow.radiusKm}km` : ""}. Great for hyper-local lurkers.`}
              </p>
            </div>
            <button
              className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-semibold text-[var(--ink-soft)]"
              onClick={() => toggleMuteFollow(follow.id)}
            >
              {follow.muted ? "Unmute" : "Mute"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {frequencies.map((frequency) => (
              <button
                key={frequency}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  follow.frequency === frequency
                    ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                    : "bg-[var(--surface-strong)] text-[var(--ink-soft)]"
                }`}
                onClick={() => updateFollowPreference(follow.id, frequency)}
              >
                {frequency === "immediate" && "Immediate"}
                {frequency === "daily" && "Daily digest"}
                {frequency === "off" && "Off"}
              </button>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
