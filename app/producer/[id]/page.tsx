import { notFound } from "next/navigation";

import { AddListingForm } from "@/components/contributions/add-listing-form";
import { ClaimSection } from "@/components/contributions/claim-section";
import { ReportButton } from "@/components/contributions/report-button";
import { RevisionHistory } from "@/components/contributions/revision-history";
import { CategoryFollowButton } from "@/components/notifications/category-follow-button";
import { FollowButton } from "@/components/notifications/follow-button";
import { ListingCard } from "@/components/listings/listing-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getProducerData, getListingsData } from "@/lib/data/bridge";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function getProducerFollowerCount(producerId: string): Promise<number> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return 0;
  const { count } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follow_type", "producer")
    .eq("producer_id", producerId);
  return count ?? 0;
}

export default async function ProducerPage({ params }: { params: { id: string } }) {
  const foundProducer = await getProducerData(params.id);

  if (!foundProducer) {
    notFound();
  }

  const producer = foundProducer;
  const [allListings, followerCount] = await Promise.all([
    getListingsData(),
    getProducerFollowerCount(producer.id)
  ]);
  const producerListings = allListings.filter((listing) => listing.producerId === producer.id && listing.status === "active");

  return (
    <div className="space-y-6 py-4">
      <Card className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="forest">{producer.locationLabel}</Badge>
            {producer.isCommunityMaintained ? (
              <ClaimSection producerId={producer.id} producerName={producer.name} />
            ) : null}
          </div>
          <h1 className="font-display text-5xl text-[var(--ink)]">{producer.name}</h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">{producer.bio}</p>
          {producer.websiteUrl && (
            <a
              href={producer.websiteUrl.startsWith("http") ? producer.websiteUrl : `https://${producer.websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] transition hover:opacity-80"
            >
              🌐 {producer.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            </a>
          )}
          <div className="flex flex-wrap gap-3">
            <FollowButton producerId={producer.id} producerName={producer.name} />
            {producer.isCommunityMaintained ? (
              <AddListingForm
                producerId={producer.id}
                producerName={producer.name}
                defaultCategory={producer.categories[0]}
                triggerClassName="bg-[var(--forest)] hover:bg-[var(--forest)]/90"
              />
            ) : null}
            {producer.categories.map((category) => (
              <CategoryFollowButton key={category} category={category} />
            ))}
            <RevisionHistory scope={{ producerId: producer.id }} />
            <ReportButton targetType="profile" targetId={producer.id} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Info title="Pickup details" body={producer.pickupDetails} />
            <Info title="Operating schedule" body={producer.scheduleSummary} />
          </div>
        </div>
        <Card className="space-y-3 bg-[var(--surface-strong)]">
          {followerCount > 0 ? (
            <>
              <h2 className="font-display text-3xl text-[var(--ink)]">
                {followerCount} {followerCount === 1 ? "follower" : "followers"}
              </h2>
              <p className="text-sm leading-6 text-[var(--ink-soft)]">
                People follow this neighbour for quick updates, seasonal favourites, and the occasional &ldquo;last few&rdquo; panic sprint.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-3xl text-[var(--ink)]">Be the first to follow</h2>
              <p className="text-sm leading-6 text-[var(--ink-soft)]">
                Nobody&apos;s in the loop yet. Start following and you&apos;ll be first when something fresh lands.
              </p>
            </>
          )}
          <div className="flex flex-wrap gap-2">
            {producer.categories.map((category) => (
              <Badge key={category} tone="accent">
                {category}
              </Badge>
            ))}
          </div>
        </Card>
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-3xl text-[var(--ink)]">Active listings</h2>
          <p className="text-sm text-[var(--ink-soft)]">What they&apos;ve got available right now.</p>
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
