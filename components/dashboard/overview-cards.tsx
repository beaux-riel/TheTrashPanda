"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHarvestLink } from "@/hooks/use-harvestlink";

export function OverviewCards() {
  const { dashboardProducer, followerPreview, listings, quickPostListing } = useHarvestLink();

  const activeListings = listings.filter((listing) => listing.status === "active").length;
  const totalViews = listings.reduce((sum, listing) => sum + listing.views, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <Card className="space-y-4">
        <Badge tone="accent">Producer overview</Badge>
        <div className="space-y-2">
          <h2 className="font-display text-3xl text-[var(--ink)]">You&apos;ve got the porch looking lively.</h2>
          <p className="text-sm leading-6 text-[var(--ink-soft)]">
            {dashboardProducer.name} is live with {activeListings} active listings, {dashboardProducer.followerCount} followers, and a respectable amount of neighbour snooping.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => quickPostListing()}>Post what you&apos;ve got</Button>
          <Link className={buttonStyles("secondary")} href="/dashboard/listings">
            Tidy listings
          </Link>
        </div>
      </Card>
      <StatCard label="Active listings" value={activeListings.toString()} note="Live on the map/feed stub" />
      <StatCard label="Followers" value={dashboardProducer.followerCount.toString()} note={`${followerPreview.length} names visible`} />
      <StatCard label="Views this week" value={totalViews.toString()} note="Eggs are still the headliner" />
    </div>
  );
}

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <Card className="space-y-2">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink-soft)]">{label}</p>
      <p className="font-display text-4xl text-[var(--ink)]">{value}</p>
      <p className="text-sm text-[var(--ink-soft)]">{note}</p>
    </Card>
  );
}
