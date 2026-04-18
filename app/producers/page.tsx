import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import { getProducersData, getListingsData } from "@/lib/data/bridge";

export const metadata = {
  title: "Your Neighbours",
  description: "People sharing food in Powell River, BC — backyard gardeners, hobby farmers, home bakers, and anyone with more than they need.",
};

export default async function ProducersPage() {
  const [producers, listings] = await Promise.all([
    getProducersData(),
    getListingsData(),
  ]);

  // Count active listings per producer
  const listingCounts = new Map<string, number>();
  for (const listing of listings) {
    if (listing.status === "active") {
      listingCounts.set(
        listing.producerId,
        (listingCounts.get(listing.producerId) ?? 0) + 1
      );
    }
  }

  return (
    <div className="space-y-6 py-2 sm:py-4">
      <div>
        <h1 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
          Your Neighbours
        </h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)] sm:text-base">
          {producers.length} people sharing food in Powell River — backyard gardeners,
          home bakers, hobby farmers, and folks with more plums than friends.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {producers.map((producer) => {
          const count = listingCounts.get(producer.id) ?? 0;
          return (
            <Link key={producer.id} href={`/producer/${producer.slug}`}>
              <Card className="flex h-full flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display text-xl text-[var(--ink)] sm:text-2xl">
                    {producer.name}
                  </h2>
                  {count > 0 && (
                    <Badge tone="gold" className="shrink-0">
                      {count} listing{count !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
                <p className="line-clamp-3 text-sm leading-6 text-[var(--ink-soft)]">
                  {producer.bio}
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {producer.categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full bg-[var(--surface-strong)] px-2.5 py-1 text-xs font-semibold text-[var(--ink-soft)]"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[var(--ink-soft)]">
                  📍 {producer.locationLabel}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
        <div className="mx-auto max-w-lg space-y-4 text-center sm:text-center">
          <h2 className="font-display text-4xl text-[var(--ink)]">Know someone with more than they need?</h2>
          <p className="text-base leading-7 text-[var(--ink-soft)]">
            A garden, a fruit tree, a baking habit that got out of hand — if someone you know has food worth sharing, help them join the loop. It only takes a minute.
          </p>
          <div>
            <Link className={buttonStyles("secondary") + " inline-block"} href="/onboarding">
              Join the loop
            </Link>
          </div>
        </div>
        <Image
          src="/images/bandit/bandit-flower-crown-wave.webp"
          alt="Bandit waving"
          width={320}
          height={320}
          className="mx-auto rounded-2xl"
        />
      </Card>
    </div>
  );
}
