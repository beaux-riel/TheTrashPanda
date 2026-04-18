import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getListingData, getProducerData } from "@/lib/data/bridge";
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
  const description = `${producer?.name ?? "Neighbour"} listed ${listing.title}. ${listing.distanceLabel}. ${listing.priceLabel}.`;

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
  return (
    <div className="grid gap-6 py-4 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="space-y-4">
        <Badge tone="accent">{listing.category}</Badge>
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
      </Card>
      <Card className="space-y-4">
        <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl">
          <Image
            src={getListingImage(listing.title, listing.category)}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="280px"
          />
        </div>
        <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-xl">
          <Image
            src="/images/bandit/bandit-flower-crown-basket.webp"
            alt="Bandit approves"
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <p className="text-center text-xs italic text-[var(--ink-soft)]">
          Bandit says: support your neighbours. Every dollar spent local stays local.
        </p>
      </Card>
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
