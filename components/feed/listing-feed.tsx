"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { BanditIllustration } from "@/components/brand/bandit-illustration";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { categoryPalette, type Listing, type Producer } from "@/lib/data/mock";
import {
  getListingDistanceLabel,
  getListingTimeAgo,
  getProducerMap,
  quantityLabels,
  type UserLocation
} from "@/lib/discovery";

export function ListingFeed({
  listings,
  producers,
  userLocation,
  refreshing,
  onRefresh
}: {
  listings: Listing[];
  producers: Producer[];
  userLocation: UserLocation | null;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const producerMap = useMemo(() => getProducerMap(producers), [producers]);

  if (!listings.length) {
    return (
      <Card className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
        <BanditIllustration variant="empty" className="max-w-[160px]" />
        <div className="space-y-2">
          <h3 className="font-display text-3xl text-[var(--ink)]">Feed&apos;s gone a bit quiet</h3>
          <p className="max-w-md text-sm leading-6 text-[var(--ink-soft)]">
            Nobody&apos;s waving food around right now. This one&apos;s gone. Follow them to catch the next batch.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div
      className="space-y-4"
      onTouchStart={(event) => {
        if (window.scrollY === 0) {
          setTouchStartY(event.touches[0]?.clientY ?? null);
        }
      }}
      onTouchMove={(event) => {
        if (touchStartY === null) {
          return;
        }

        setPullDistance(Math.max(0, Math.min(96, (event.touches[0]?.clientY ?? touchStartY) - touchStartY)));
      }}
      onTouchEnd={() => {
        if (pullDistance > 72) {
          onRefresh();
        }

        setTouchStartY(null);
        setPullDistance(0);
      }}
    >
      <div
        className="overflow-hidden rounded-full bg-[var(--surface)] text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)] transition-[max-height,opacity,padding]"
        style={{
          maxHeight: pullDistance || refreshing ? 56 : 0,
          opacity: pullDistance || refreshing ? 1 : 0,
          padding: pullDistance || refreshing ? "0.875rem" : "0 0.875rem"
        }}
      >
        {refreshing ? "Bandit is shaking the tree for fresh posts..." : pullDistance > 72 ? "Release to refresh" : "Pull for fresh finds"}
      </div>

      <div className="space-y-4">
        {listings.map((listing) => {
          const producer = producerMap[listing.producerId];

          return (
            <Link key={listing.id} href={`/listing/${listing.id}`}>
              <Card className="grid gap-4 overflow-hidden p-0 transition hover:-translate-y-0.5 sm:grid-cols-[160px_1fr]">
                <div
                  className="relative min-h-[150px] bg-[linear-gradient(140deg,color-mix(in_srgb,var(--forest)_26%,white),transparent),linear-gradient(135deg,var(--honey),var(--accent),var(--forest))]"
                  style={{ backgroundColor: categoryPalette[listing.category] ?? "var(--surface-strong)" }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_48%)]" />
                  <div className="absolute bottom-4 left-4 rounded-full bg-[rgba(255,255,255,0.82)] px-3 py-1 text-xs font-semibold text-[var(--ink)]">
                    {listing.category}
                  </div>
                </div>
                <div className="flex flex-col gap-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--forest)]">{producer?.name ?? "Neighbour producer"}</p>
                      <h3 className="font-display text-3xl text-[var(--ink)]">{listing.title}</h3>
                    </div>
                    <Badge tone={listing.quantity === "last_few" ? "accent" : "gold"}>{quantityLabels[listing.quantity]}</Badge>
                  </div>
                  <p className="text-sm leading-6 text-[var(--ink-soft)]">{listing.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="neutral">{listing.priceLabel}</Badge>
                    <Badge tone="forest">{getListingDistanceLabel(listing, userLocation)}</Badge>
                    <Badge tone="gold">{getListingTimeAgo(listing)}</Badge>
                  </div>
                  <p className="text-xs text-[var(--ink-soft)]">{listing.locationLabel}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
