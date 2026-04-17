import { notFound } from "next/navigation";

import { CategoryFollowButton } from "@/components/notifications/category-follow-button";
import { FollowButton } from "@/components/notifications/follow-button";
import { ListingCard } from "@/components/listings/listing-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { listings, producers } from "@/lib/data/mock";

export default function ProducerPage({ params }: { params: { id: string } }) {
  const foundProducer = producers.find((item) => item.slug === params.id);

  if (!foundProducer) {
    notFound();
  }

  const producer = foundProducer;
  const producerListings = listings.filter((listing) => listing.producerId === producer.id && listing.status === "active");

  return (
    <div className="space-y-6 py-4">
      <Card className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <Badge tone="forest">{producer.locationLabel}</Badge>
          <h1 className="font-display text-5xl text-[var(--ink)]">{producer.name}</h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">{producer.bio}</p>
          <div className="flex flex-wrap gap-3">
            <FollowButton producerId={producer.id} producerName={producer.name} />
            {producer.categories.map((category) => (
              <CategoryFollowButton key={category} category={category} />
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Info title="Pickup details" body={producer.pickupDetails} />
            <Info title="Operating schedule" body={producer.scheduleSummary} />
          </div>
        </div>
        <Card className="space-y-3 bg-[var(--surface-strong)]">
          <h2 className="font-display text-3xl text-[var(--ink)]">{producer.followerCount} followers</h2>
          <p className="text-sm leading-6 text-[var(--ink-soft)]">
            People follow this producer for quick updates, neighbourhood staples, and the occasional “last few” panic sprint.
          </p>
          <div className="flex flex-wrap gap-2">
            {producer.categories.map((category) => (
              <Badge key={category} tone="accent">
                {category}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-[var(--ink-soft)]">Map/profile details are intentionally stubbed here so the following flows stay front and centre.</p>
        </Card>
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-3xl text-[var(--ink)]">Active listings</h2>
          <p className="text-sm text-[var(--ink-soft)]">What this producer has up right now, server-rendered so links share nicely.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {producerListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
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
