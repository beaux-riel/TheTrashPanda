import Link from "next/link";

import { BanditIllustration } from "@/components/brand/bandit-illustration";
import type { BanditVariant } from "@/components/brand/bandit-illustration";
import { HomeDiscovery } from "@/components/discovery/home-discovery";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { getBanditVariant, getBanditGreeting } from "@/lib/bandit-selector";
import { getListingsData, getProducersData } from "@/lib/data/bridge";
import { getCurrentWeather } from "@/lib/weather";

export default async function HomePage() {
  const [listings, producers, weather] = await Promise.all([
    getListingsData(),
    getProducersData(),
    getCurrentWeather(),
  ]);
  const activeCount = listings.filter((l) => l.status === "active").length;

  // Get current hour in Pacific time
  const hour = parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Vancouver",
      hour: "numeric",
      hour12: false,
    }).format(new Date()),
    10
  );

  const banditState = getBanditVariant(weather.condition, hour);
  const banditVariant = banditState as BanditVariant;
  const greeting = getBanditGreeting(banditState);

  return (
    <div className="space-y-8 py-4">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-[36px] border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.7)] p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Badge tone="gold">Powell River</Badge>
            <span className="text-xs text-[var(--ink-soft)]">
              {weather.temp}°C · {weather.description}
            </span>
          </div>
          <h1 className="font-display text-5xl leading-tight text-[var(--ink)]">
            Local food without the startup costume.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">
            Browse what&apos;s nearby, follow the neighbours you trust, and let
            Bandit handle the nudges. The map below is live — the feed listens
            to the same filters, and nobody had to say &quot;ecosystem&quot; out
            loud.
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
            <Stat label="Active listings" value={activeCount.toString()} />
            <Stat label="Producers" value={producers.length.toString()} />
            <Stat label="Weather" value={`${weather.temp}°C`} />
          </dl>
        </div>
        <div className="flex flex-col items-center justify-center rounded-[36px] border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.7)] p-6 shadow-card">
          <BanditIllustration
            variant={banditVariant}
            priority
            className="max-w-[280px]"
          />
          <p className="mt-3 text-center text-sm font-medium italic text-[var(--ink-soft)]">
            🦝 {greeting}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl text-[var(--ink)]">
              Map, feed, and a decent sniff test
            </h2>
            <p className="text-sm text-[var(--ink-soft)]">
              Search, category filters, radius controls, and view toggles all
              point at the same discovery state.
            </p>
          </div>
          <Link
            className={buttonStyles("secondary")}
            href="/settings/notifications"
          >
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
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">
        {label}
      </dt>
      <dd className="mt-2 font-display text-3xl text-[var(--ink)]">{value}</dd>
    </div>
  );
}
