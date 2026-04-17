"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHarvestLink } from "@/hooks/use-harvestlink";

export function ListingManager() {
  const { listings, markListingGone, repostListing, sendTestNotification } = useHarvestLink();

  const active = listings.filter((listing) => listing.status === "active");
  const history = listings.filter((listing) => listing.status !== "active");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-3">
        <h2 className="font-display text-3xl text-[var(--ink)]">Active now</h2>
        {active.map((listing) => (
          <Card key={listing.id} className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl text-[var(--ink)]">{listing.title}</h3>
                <p className="text-sm text-[var(--ink-soft)]">
                  {listing.locationLabel} · {listing.views} views
                </p>
              </div>
              <Badge tone={listing.quantity === "last_few" ? "accent" : "forest"}>
                {listing.quantity === "last_few" ? "Last few" : "Still going"}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary">Edit</Button>
              <Button variant="secondary" onClick={() => sendTestNotification(listing.id)}>
                Test the ping
              </Button>
              <Button onClick={() => markListingGone(listing.id)}>Gone!</Button>
            </div>
          </Card>
        ))}
      </section>
      <section className="space-y-3">
        <h2 className="font-display text-3xl text-[var(--ink)]">History & quick reposts</h2>
        {(history.length ? history : active.slice(-2)).map((listing) => (
          <Card key={listing.id} className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl text-[var(--ink)]">{listing.title}</h3>
                <p className="text-sm text-[var(--ink-soft)]">{listing.postedLabel}</p>
              </div>
              <Badge tone="neutral">{listing.status === "active" ? "Template-ready" : listing.status}</Badge>
            </div>
            <Button onClick={() => repostListing(listing.id)}>Post again</Button>
          </Card>
        ))}
      </section>
    </div>
  );
}
