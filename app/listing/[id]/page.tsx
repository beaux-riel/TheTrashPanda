import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContributorBadge } from "@/components/contributions/contributor-badge";
import { FreshnessWidget } from "@/components/contributions/freshness-widget";
import { RevisionHistory } from "@/components/contributions/revision-history";
import { StaleBanner } from "@/components/contributions/stale-banner";
import { ListingCard } from "@/components/listings/listing-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getListingData, getListingsData, getProducerData } from "@/lib/data/bridge";
import { getListingImage } from "@/lib/listing-images";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const listing = await getListingData(params.id);

  if (!listing) {
    return {
      title: "Listing not found"
    };
  }

  const producer = await getProducerData(listing.producerId);
  const title = `${listing.title} in Powell River`;
  const description = `${producer?.name ?? "A neighbour"} is sharing ${listing.title}. ${listing.distanceLabel}. ${listing.priceLabel}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article"
    }
  };
}

export default async function ListingPage({ params }: { params: { id: string } }) {
  const foundListing = await getListingData(params.id);

  if (!foundListing) {
    notFound();
  }

  const listing = foundListing;
  const foundProducer = await getProducerData(listing.producerId);

  if (!foundProducer) {
    notFound();
  }

  const producer = foundProducer;
  const allListings = await getListingsData();
  const moreFromProducer = allListings.filter(
    (l) => l.producerId === producer.id && l.id !== listing.id && l.status === "active"
  );
  const similarListings = allListings.filter(
    (l) => l.category === listing.category && l.producerId !== producer.id && l.id !== listing.id && l.status === "active"
  ).slice(0, 3);

  return (
    <div className="space-y-6 py-4">
      <StaleBanner listingId={listing.id} />
      {/* Hero: listing details + illustration */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">{listing.category}</Badge>
            {listing.contributorName ? (
              <ContributorBadge
                displayName={listing.contributorName}
                href={listing.contributedBy ? `/profile/${listing.contributedBy}` : undefined}
              />
            ) : null}
            <RevisionHistory scope={{ listingId: listing.id }} />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-5xl text-[var(--ink)]">{listing.title}</h1>
            <p className="text-lg leading-8 text-[var(--ink-soft)]">{listing.description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Detail label="Producer" value={producer.name} />
            <Detail label="Distance" value={listing.distanceLabel} />
            <Detail label="Price" value={listing.priceLabel} />
            <Detail label="Available until" value={listing.availableUntil} />
            <Detail label="Quantity" value={listing.quantity.replace("_", " ")} />
            <Detail label="Pickup" value={listing.locationLabel} />
          </div>
          <FreshnessWidget listingId={listing.id} variant="full" />
        </Card>
        <Card className="relative overflow-hidden p-0">
          <Image
            src={getListingImage(listing.title, listing.category)}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        </Card>
      </div>

      {/* About the producer */}
      <Card className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-soft)]">About your neighbour</p>
          <Link href={`/producer/${producer.slug ?? producer.id}`} className="block font-display text-3xl text-[var(--ink)] hover:underline">
            {producer.name}
          </Link>
          {producer.bio && (
            <p className="max-w-xl text-sm leading-6 text-[var(--ink-soft)]">{producer.bio}</p>
          )}
          {producer.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {producer.categories.map((cat) => (
                <Badge key={cat} tone="accent">{cat}</Badge>
              ))}
            </div>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {producer.pickupDetails && <Info title="Pickup details" body={producer.pickupDetails} />}
          {producer.scheduleSummary && <Info title="Schedule" body={producer.scheduleSummary} />}
          {producer.locationLabel && <Info title="Location" body={producer.locationLabel} />}
          <div className="flex items-end">
            <Link
              href={`/producer/${producer.slug ?? producer.id}`}
              className="rounded-full bg-[var(--surface-strong)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--border)]"
            >
              View full profile
            </Link>
          </div>
        </div>
        <p className="col-span-full text-center text-xs italic text-[var(--ink-soft)]">
          Every dollar spent on a neighbour&apos;s food stays in town. That&apos;s the whole idea.
        </p>
      </Card>

      {/* More from this producer */}
      {moreFromProducer.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-3xl text-[var(--ink)]">More from {producer.name}</h2>
            <p className="text-sm text-[var(--ink-soft)]">Other things they&apos;ve got available right now.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {moreFromProducer.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      {/* Similar listings from other producers */}
      {similarListings.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-3xl text-[var(--ink)]">Similar {listing.category.toLowerCase()}</h2>
            <p className="text-sm text-[var(--ink-soft)]">Other {listing.category.toLowerCase()} available from neighbours nearby.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {similarListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-[var(--surface-strong)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-soft)]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[var(--ink)]">{value}</p>
    </div>
  );
}

function Info({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[24px] bg-[var(--surface-strong)] p-4">
      <h3 className="font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{body}</p>
    </div>
  );
}
