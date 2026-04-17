import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { categoryPalette, type Listing } from "@/lib/data/mock";

const quantityCopy: Record<Listing["quantity"], string> = {
  plenty: "Plenty",
  some: "Some left",
  last_few: "Last few"
};

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">{listing.postedLabel}</p>
          <Link href={`/listing/${listing.id}`} className="mt-1 block font-display text-2xl text-[var(--ink)]">
            {listing.title}
          </Link>
        </div>
        <span
          className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-[var(--ink)]"
          style={{ backgroundColor: `${categoryPalette[listing.category] ?? "#E7DED1"}55` }}
        >
          {listing.category}
        </span>
      </div>
      <p className="text-sm leading-6 text-[var(--ink-soft)]">{listing.description}</p>
      <div className="flex flex-wrap gap-2">
        <Badge tone="accent">{quantityCopy[listing.quantity]}</Badge>
        <Badge tone="neutral">{listing.priceLabel}</Badge>
        <Badge tone="forest">{listing.distanceLabel}</Badge>
      </div>
      <p className="text-xs text-[var(--ink-soft)]">
        {listing.locationLabel} · Available until {listing.availableUntil}
      </p>
    </Card>
  );
}
