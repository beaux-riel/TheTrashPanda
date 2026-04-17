"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHarvestLink } from "@/hooks/use-harvestlink";

export function FollowerRoster() {
  const { dashboardProducer, followerPreview } = useHarvestLink();

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-3xl text-[var(--ink)]">{dashboardProducer.followerCount} neighbours following along</h2>
          <p className="text-sm text-[var(--ink-soft)]">Display names only. No snooping on private details. We&apos;re nosy, not rude.</p>
        </div>
        <Link className={buttonStyles("secondary")} href="/dashboard/followers">
          See the full roster
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {followerPreview.slice(0, 6).map((follower) => (
          <div key={follower.id} className="rounded-[22px] bg-[var(--surface-strong)] p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-[var(--ink)]">{follower.name}</p>
              <Badge tone="neutral">Follower</Badge>
            </div>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">{follower.note}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
