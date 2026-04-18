"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { BanditIllustration } from "@/components/brand/bandit-illustration";
import { ContributorBadge } from "@/components/contributions/contributor-badge";
import { FreshnessDot } from "@/components/contributions/freshness-dot";
import { FreshnessWidget } from "@/components/contributions/freshness-widget";
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
import { getListingImage } from "@/lib/listing-images";

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

      <div className="space-y-6">
        {listings.map((listing) => {
          const producer = producerMap[listing.producerId];

          return (
            <Link key={listing.id} href={`/listing/${listing.id}`}>
              <Card className="grid gap-4 overflow-hidden p-0 transition hover:-translate-y-0.5 sm:grid-cols-[160px_1fr]">
                <div
                  className="relative min-h-[150px]"
                  style={{ backgroundColor: categoryPalette[listing.category] ? `${categoryPalette[listing.category]}18` : "var(--surface)" }}
                >
                  <Image
                    src={getListingImage(listing.title, listing.category)}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 160px"
                  />
                  <div className="absolute bottom-3 left-3 rounded-full bg-[rgba(255,255,255,0.88)] px-3 py-1 text-xs font-semibold text-[var(--ink)] shadow-sm">
                    {listing.category}
                  </div>
                </div>
                <div className="flex flex-col gap-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--forest)]">{producer?.name ?? "A neighbour"}</p>
                      <h3 className="flex items-center gap-2 font-display text-3xl text-[var(--ink)]">
                        <FreshnessDot listingId={listing.id} />
                        {listing.title}
                      </h3>
                    </div>
                    <Badge tone={listing.quantity === "last_few" ? "accent" : "gold"}>{quantityLabels[listing.quantity]}</Badge>
                  </div>
                  <p className="text-sm leading-6 text-[var(--ink-soft)]">{listing.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="neutral">{listing.priceLabel}</Badge>
                    <Badge tone="forest">{getListingDistanceLabel(listing, userLocation)}</Badge>
                    <Badge tone="gold">{getListingTimeAgo(listing)}</Badge>
                  </div>
                  {listing.contributorName ? (
                    <ContributorBadge
                      displayName={listing.contributorName}
                      href={listing.contributedBy ? `/profile/${listing.contributedBy}` : undefined}
                    />
                  ) : null}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-[var(--ink-soft)]">{listing.locationLabel}</p>
                    <FreshnessWidget listingId={listing.id} variant="compact" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
