import Image from "next/image";
import Link from "next/link";

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
    <div className="space-y-6 py-2 sm:space-y-8 sm:py-4">
      {/* Hero — stacks on mobile, side-by-side on desktop */}
      <section className="grid gap-4 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.7)] p-5 shadow-card sm:rounded-[36px] sm:p-6">
          <div className="flex items-center gap-2">
            <Badge tone="gold">Powell River</Badge>
            <span className="text-xs text-[var(--ink-soft)]">
              {weather.temp}°C · {weather.description}
            </span>
          </div>
          <h1 className="font-display text-3xl leading-tight text-[var(--ink)] sm:text-4xl lg:text-5xl">
            Skip the supermarket. Buy from your neighbours.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--ink-soft)] sm:text-lg sm:leading-8">
            Real food from real people, not warehouse shelves.
            No markup, no middlemen — just the local food loop.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link className={buttonStyles()} href="/onboarding">
              Get started
            </Link>
            <Link className={buttonStyles("secondary")} href="/about">
              Learn more
            </Link>
          </div>
          <dl className="grid grid-cols-3 gap-3 pt-2 sm:gap-4 sm:pt-4">
            <Stat label="Listings" value={activeCount.toString()} />
            <Stat label="Producers" value={producers.length.toString()} />
            <Stat label="Weather" value={`${weather.temp}°C`} />
          </dl>
        </div>

        {/* Bandit card — full-bleed image with overlaid subtext */}
        <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-[color:var(--border)] shadow-card sm:min-h-[360px] sm:rounded-[36px]">
          <Image
            src={`/images/bandit/${banditVariant}.webp`}
            alt="Bandit the trash panda"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-5 pb-5 pt-12 sm:px-6 sm:pb-6">
            <p className="text-center text-sm font-medium italic text-white/90 drop-shadow-sm">
              {greeting}
            </p>
          </div>
        </div>
      </section>

      {/* Discovery section */}
      <section className="space-y-3 sm:space-y-4">
        <div>
          <h2 className="font-display text-2xl text-[var(--ink)] sm:text-3xl">
            What&apos;s available now
          </h2>
          <p className="text-sm text-[var(--ink-soft)]">
            Browse listings from local producers in Powell River.
          </p>
        </div>
        <HomeDiscovery />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--surface)] p-3 sm:rounded-[24px] sm:p-4">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-soft)] sm:text-xs sm:tracking-[0.18em]">
        {label}
      </dt>
      <dd className="mt-1 font-display text-xl text-[var(--ink)] sm:mt-2 sm:text-3xl">{value}</dd>
    </div>
  );
}
