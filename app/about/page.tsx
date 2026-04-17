import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BanditIllustration } from "@/components/brand/bandit-illustration";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description:
    "HarvestLink is decentralised food infrastructure for small towns. Open source, community-owned, raccoon-endorsed.",
};

export default function AboutPage() {
  return (
    <div className="space-y-10 py-6">
      {/* Hero */}
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Why this exists
          </p>
          <h1 className="font-display text-5xl leading-tight text-[var(--ink)]">
            Your grocery store gets 1,400 trucks a year from somewhere else.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">
            Your neighbour has 200 pounds of zucchini and nowhere to put it.
            This is a coordination problem, not a supply problem.
          </p>
          <p className="max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">
            HarvestLink makes the invisible local food economy visible. Every
            small town has people growing, baking, preserving, and selling food
            from their homes — but nobody knows about it unless they already
            know.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className={buttonStyles()} href="/">
              See the map
            </Link>
            <Link
              className={buttonStyles("secondary")}
              href="https://github.com/beaux-riel/HarvestLink"
            >
              View on GitHub
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <BanditIllustration variant="onboarding" className="max-w-[300px]" />
        </div>
      </section>

      {/* The Problem */}
      <section className="space-y-6">
        <h2 className="font-display text-3xl text-[var(--ink)]">
          The invisible food economy
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="space-y-3">
            <div className="relative mx-auto h-24 w-24">
              <Image
                src="/images/bandit/ferry-waiting.webp"
                alt="Bandit waiting for the ferry"
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
            <h3 className="font-display text-xl text-[var(--ink)]">
              Supply chain fragility
            </h3>
            <p className="text-sm leading-6 text-[var(--ink-soft)]">
              Powell River is accessible by ferry. When the ferry doesn&apos;t
              run, the trucks don&apos;t come. But the gardens still grow.
            </p>
          </Card>
          <Card className="space-y-3">
            <div className="relative mx-auto h-24 w-24">
              <Image
                src="/images/bandit/midday-market.webp"
                alt="Bandit at the market"
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
            <h3 className="font-display text-xl text-[var(--ink)]">
              Invisible producers
            </h3>
            <p className="text-sm leading-6 text-[var(--ink-soft)]">
              There are hobby farms, driveway sellers, backyard beekeepers,
              bread bakers — everywhere. Most people don&apos;t know they exist.
            </p>
          </Card>
          <Card className="space-y-3">
            <div className="relative mx-auto h-24 w-24">
              <Image
                src="/images/bandit/bread-morning.webp"
                alt="Bandit with bread"
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
            <h3 className="font-display text-xl text-[var(--ink)]">
              Money leaving town
            </h3>
            <p className="text-sm leading-6 text-[var(--ink-soft)]">
              Every dollar spent at a chain grocery store leaves the community.
              Every dollar spent on a neighbour&apos;s eggs stays.
            </p>
          </Card>
        </div>
      </section>

      {/* Open Source */}
      <section className="rounded-[36px] border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.7)] p-8 shadow-card">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="flex items-center justify-center">
            <BanditIllustration variant="spring" className="max-w-[200px]" />
          </div>
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-[var(--ink)]">
              Open source forever
            </h2>
            <p className="text-lg leading-8 text-[var(--ink-soft)]">
              Community food infrastructure shouldn&apos;t be locked down. The
              code is{" "}
              <Link
                href="https://github.com/beaux-riel/HarvestLink"
                className="font-semibold text-[var(--accent)] underline"
              >
                MIT-licensed on GitHub
              </Link>
              . Fork it, run it for your town, make it yours.
            </p>
            <p className="text-lg leading-8 text-[var(--ink-soft)]">
              We don&apos;t extract from producers. The value is in the network,
              not the platform. Premium features for commercial producers,
              hosted infrastructure for other communities, and food resilience
              grants — that&apos;s the model.
            </p>
          </div>
        </div>
      </section>

      {/* Built in Powell River */}
      <section className="space-y-4 text-center">
        <div className="relative mx-auto h-32 w-32">
          <Image
            src="/images/bandit/street.webp"
            alt="Bandit on the streets of Powell River"
            fill
            className="object-contain"
            sizes="128px"
          />
        </div>
        <h2 className="font-display text-3xl text-[var(--ink)]">
          Built in Powell River, BC
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">
          Population ~13,000. Accessible by ferry. Home to more backyard gardens
          per capita than anyone&apos;s bothered to count. If decentralised food
          infrastructure works here, it works anywhere.
        </p>
        <p className="text-sm italic text-[var(--ink-soft)]">
          Start local. Stay local. Know your food. Know your neighbour.
        </p>
      </section>
    </div>
  );
}
