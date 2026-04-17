import Link from "next/link";

import { BanditIllustration } from "@/components/brand/bandit-illustration";
import { HomeDiscovery } from "@/components/discovery/home-discovery";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { buildCommunitySnapshot, producers } from "@/lib/data/mock";

export default function HomePage() {
  const snapshot = buildCommunitySnapshot();

  return (
    <div className="space-y-8 py-4">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-[36px] border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.7)] p-6 shadow-card">
          <Badge tone="gold">Powell River default community</Badge>
          <h1 className="font-display text-5xl leading-tight text-[var(--ink)]">
            Local food without the startup costume.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">
            Browse what&apos;s nearby, follow the neighbours you trust, and let Bandit handle the nudges. The map below is live now, the feed listens to the same filters, and nobody had to say &quot;ecosystem&quot; out loud.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className={buttonStyles()} href="/producer/cedar-bloom">
              Visit a producer
            </Link>
            <Link className={buttonStyles("secondary")} href="/onboarding">
              Start onboarding
            </Link>
            <Link className={buttonStyles("secondary")} href="/dashboard">
              Open producer dashboard
            </Link>
          </div>
          <dl className="grid gap-4 pt-4 sm:grid-cols-3">
            <Stat label="Active listings" value={snapshot.activeListings.toString()} />
            <Stat label="Producers on watch" value={producers.length.toString()} />
            <Stat label="Season vibe" value={snapshot.season} />
          </dl>
        </div>
        <div className="rounded-[36px] border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.7)] p-6 shadow-card">
          <BanditIllustration variant={snapshot.season} priority />
          <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">
            Bandit changes outfits with the season, stays accessible, and shows up in loading, onboarding, empty, error, and 404 states.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl text-[var(--ink)]">Map, feed, and a decent sniff test</h2>
            <p className="text-sm text-[var(--ink-soft)]">
              Search, category filters, radius controls, and view toggles all point at the same discovery state.
            </p>
          </div>
          <Link className={buttonStyles("secondary")} href="/settings/notifications">
            Tune your pings
          </Link>
        </div>
        <HomeDiscovery />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-[var(--surface)] p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">{label}</dt>
      <dd className="mt-2 font-display text-3xl text-[var(--ink)]">{value}</dd>
    </div>
  );
}
