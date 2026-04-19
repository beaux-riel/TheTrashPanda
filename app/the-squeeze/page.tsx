import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "The Squeeze — Where Your Grocery Money Goes",
  description:
    "Three companies control 80% of Canadian grocery. See how much they extract from communities like Powell River — and what the alternative looks like.",
  openGraph: {
    title: "The Squeeze — Where Your Grocery Money Goes",
    description:
      "Three companies control 80% of Canadian grocery. See how much they extract from communities like Powell River — and what the alternative looks like.",
    type: "article",
    locale: "en_CA",
  },
};

type Chain = {
  name: string;
  parent?: string;
  ticker: string;
  revenue: string;
  profit: string;
  profitNote?: string;
  brands: string[];
  extra: { label: string; value: string }[];
  sourceLabel: string;
  sourceHref: string;
  fiscalYear: string;
};

const chains: Chain[] = [
  {
    name: "Loblaw Companies",
    parent: "George Weston Ltd",
    ticker: "TSX: L",
    revenue: "CA$61.0B",
    profit: "CA$2.275B",
    brands: [
      "Loblaws",
      "No Frills",
      "Real Canadian Superstore",
      "Shoppers Drug Mart",
      "T&T",
      "Provigo",
      "Maxi",
      "Fortinos",
      "Zehrs",
      "Your Independent Grocer",
      "Valu-mart",
    ],
    extra: [
      { label: "Employees", value: "~220,000" },
      { label: "Chairman", value: "Galen Weston Jr" },
    ],
    sourceLabel: "loblaw.ca investor relations",
    sourceHref: "https://www.loblaw.ca/en/investors-landing",
    fiscalYear: "FY2024",
  },
  {
    name: "Empire Company",
    parent: "Sobeys",
    ticker: "TSX: EMP.A",
    revenue: "~CA$30.7B",
    profit: "~CA$740M",
    profitNote: "approx.",
    brands: [
      "Sobeys",
      "Safeway (Canada)",
      "IGA",
      "Foodland",
      "FreshCo",
      "Farm Boy",
      "Thrifty Foods",
      "Longo's",
    ],
    extra: [
      { label: "Employees", value: "~130,000" },
      { label: "HQ", value: "Stellarton, NS" },
    ],
    sourceLabel: "empireco.ca",
    sourceHref: "https://www.empireco.ca",
    fiscalYear: "FY2024",
  },
  {
    name: "Metro Inc.",
    ticker: "TSX: MRU",
    revenue: "CA$21.2B",
    profit: "See annual report",
    profitNote: "see report",
    brands: ["Metro", "Super C", "Food Basics", "Jean Coutu", "Brunet", "Marché Adonis"],
    extra: [
      { label: "Employees", value: "~90,000" },
      { label: "HQ", value: "Montreal, QC" },
    ],
    sourceLabel: "corpo.metro.ca",
    sourceHref: "https://corpo.metro.ca/en/investor-relations.html",
    fiscalYear: "FY2024",
  },
];

export default function TheSqueezePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero */}
      <section className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <Badge tone="gold">Follow the money</Badge>
          <h1 className="font-display text-5xl leading-[1.05] text-[var(--ink)] sm:text-6xl">
            The Squeeze.
          </h1>
          <p className="text-xl leading-8 text-[var(--ink-soft)]">
            Three companies control roughly 80% of Canadian grocery. Every time
            the ferry rolls in, a slice of Powell River&apos;s paycheque rolls
            back out — to Toronto, Stellarton, Montreal.
          </p>
          <p className="text-base leading-7 text-[var(--ink-soft)]">
            Here&apos;s what they pulled in last year, from public filings. No
            spin, no guessing — just the numbers they had to publish.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link className={buttonStyles()} href="/producers">
              See your neighbours
            </Link>
            <Link className={buttonStyles("secondary")} href="#the-big-three">
              The numbers
            </Link>
          </div>
        </div>
        <div className="relative min-h-[320px] overflow-hidden rounded-[36px] border border-[color:var(--border)] shadow-card sm:min-h-[420px]">
          <Image
            src="/images/bandit/storm-dramatic.webp"
            alt="Bandit watching storm clouds gather over the town — concerned"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-6 pt-16">
            <p className="text-center text-base font-medium italic text-white/95 drop-shadow-sm">
              &ldquo;The food&apos;s here. The money shouldn&apos;t have to leave.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* The Big Three */}
      <section id="the-big-three" className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            The Big Three
          </p>
          <h2 className="font-display text-4xl text-[var(--ink)]">
            Where the money actually goes.
          </h2>
          <p className="max-w-2xl text-[var(--ink-soft)]">
            Annual figures from each company&apos;s most recent public filings.
            Net profit is what&apos;s extracted after expenses — the money that
            leaves your community for good.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {chains.map((chain) => (
            <Card key={chain.name} className="space-y-5">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-2xl text-[var(--ink)]">
                    {chain.name}
                  </h3>
                  <span className="rounded-full bg-[var(--surface-strong)] px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[var(--ink-soft)]">
                    {chain.ticker}
                  </span>
                </div>
                {chain.parent && (
                  <p className="text-xs text-[var(--ink-soft)]">
                    Parent: {chain.parent}
                  </p>
                )}
              </div>

              <dl className="grid grid-cols-2 gap-3 border-y border-[color:var(--border)] py-4">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                    Revenue ({chain.fiscalYear})
                  </dt>
                  <dd className="mt-1 font-display text-3xl leading-none text-[var(--ink)]">
                    {chain.revenue}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                    Net profit {chain.profitNote ? `(${chain.profitNote})` : "(annual)"}
                  </dt>
                  <dd
                    className="mt-1 font-display text-3xl leading-none"
                    style={{ color: "#D94F30" }}
                  >
                    {chain.profit}
                  </dd>
                </div>
              </dl>

              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                  Brands
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {chain.brands.map((b) => (
                    <span
                      key={b}
                      className="rounded-full bg-[var(--surface-strong)] px-2.5 py-1 text-xs text-[var(--ink)]"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3">
                {chain.extra.map((item) => (
                  <div key={item.label}>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                      {item.label}
                    </dt>
                    <dd className="mt-0.5 text-sm text-[var(--ink)]">{item.value}</dd>
                  </div>
                ))}
              </dl>

              <a
                href={chain.sourceHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-xs font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
              >
                Source: {chain.sourceLabel} →
              </a>
            </Card>
          ))}
        </div>
      </section>

      {/* Combined Impact */}
      <section className="rounded-[36px] border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.7)] p-8 shadow-card sm:p-10">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Combined impact
            </p>
            <h2 className="font-display text-4xl text-[var(--ink)]">
              Three companies. One tight grip.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <BigStat
              label="Combined revenue"
              value="~CA$113B"
              sub="per year"
              tone="ink"
            />
            <BigStat
              label="Combined net profit"
              value="~CA$3.7B"
              sub="extracted annually"
              tone="tomato"
            />
            <BigStat
              label="Grocery market share"
              value="~80%"
              sub="of Canada"
              tone="forest"
            />
          </div>

          {/* Market share visual */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">
              Who owns the aisle
            </p>
            <div className="flex h-8 overflow-hidden rounded-full border border-[color:var(--border)]">
              <div
                className="flex items-center justify-center text-[10px] font-semibold text-white"
                style={{ width: "54%", backgroundColor: "#D94F30" }}
                title="Loblaw — est. share of Big Three revenue"
              >
                Loblaw
              </div>
              <div
                className="flex items-center justify-center text-[10px] font-semibold text-white"
                style={{ width: "27%", backgroundColor: "#B9572E" }}
                title="Empire"
              >
                Empire
              </div>
              <div
                className="flex items-center justify-center text-[10px] font-semibold text-white"
                style={{ width: "19%", backgroundColor: "#8F4423" }}
                title="Metro"
              >
                Metro
              </div>
            </div>
            <p className="text-xs italic text-[var(--ink-soft)]">
              Bars sized by share of the ~CA$113B Big Three revenue pool. Walmart
              and Costco Canada account for much of the remaining ~20% of the
              broader market.
            </p>
          </div>
        </div>
      </section>

      {/* Local Context — Powell River */}
      <section className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative aspect-square overflow-hidden rounded-[36px] border border-[color:var(--border)] shadow-card">
          <Image
            src="/images/bandit/ferry-waiting.webp"
            alt="Bandit waiting at the ferry terminal"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </div>
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Powell River, specifically.
          </p>
          <h2 className="font-display text-4xl leading-tight text-[var(--ink)]">
            Ferry cancelled. Shelves empty. Garden&apos;s still open.
          </h2>
          <div className="space-y-4 text-lg leading-8 text-[var(--ink-soft)]">
            <p>
              Powell River is a captive market. Supply chain hiccups, the ferry
              doesn&apos;t run, or fuel prices spike — and the shelves at the
              big box go bare in about 48 hours.
            </p>
            <p>
              Meanwhile the food is <em>already here</em>. Backyard chickens.
              Raised beds. Hobby farms. Driveway honey stands. Freezers packed
              with last year&apos;s salmon.
            </p>
            <p>
              The food IS here. The network just didn&apos;t know it — until
              now.
            </p>
          </div>
          <blockquote
            className="rounded-[24px] border-l-4 p-5"
            style={{
              borderColor: "#3A5A40",
              backgroundColor: "rgba(58, 90, 64, 0.08)",
            }}
          >
            <p className="font-display text-xl leading-snug text-[var(--ink)]">
              &ldquo;When the ferry doesn&apos;t run, Save-On doesn&apos;t have
              lettuce. But your neighbour&apos;s garden does.&rdquo;
            </p>
          </blockquote>
          <p className="text-sm" style={{ color: "#3A5A40" }}>
            Every dollar spent locally stays in the community. Every dollar spent
            at the Big Three leaves town on the next ferry.
          </p>
        </div>
      </section>

      {/* The Alternative / CTA */}
      <section className="rounded-[36px] border border-[color:var(--border)] bg-[var(--accent)] p-8 text-center shadow-card sm:p-12">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="relative mx-auto h-40 w-40">
            <Image
              src="/images/bandit/hero-tomato.webp"
              alt="Bandit with a basket of local produce"
              fill
              className="object-contain"
              sizes="160px"
            />
          </div>
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            This is why The Trash Panda exists.
          </h2>
          <p className="text-lg leading-8 text-white/90">
            To make the invisible local food economy visible. Plum trees, egg
            coolers, bread windows, surplus zucchini — all the food that
            doesn&apos;t show up on a shelf, because it never needed to.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--accent)] transition hover:bg-white/90"
              href="/producers"
            >
              Your neighbours
            </Link>
            <Link
              className="rounded-full border-2 border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              href="/onboarding"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* Data Sources Footer */}
      <section className="rounded-[28px] border border-[color:var(--border)] bg-[var(--surface)] p-6 text-sm shadow-card sm:p-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <h2 className="font-display text-2xl text-[var(--ink)]">
            Data sources &amp; disclaimer
          </h2>
          <p className="text-[var(--ink-soft)]">
            Financial data sourced from public annual reports and securities
            filings. All figures are annual totals for the most recent fiscal
            year disclosed by each company. We don&apos;t publish quarterly
            breakdowns we can&apos;t cite.
          </p>
          <ul className="grid gap-2 sm:grid-cols-3">
            <SourceLink
              company="Loblaw Companies"
              fiscal="FY2024 · Revenue CA$61.0B, Net Income CA$2.275B"
              href="https://www.loblaw.ca/en/investors-landing"
            />
            <SourceLink
              company="Empire Company"
              fiscal="FY2024 · Revenue ~CA$30.7B, Net Income ~CA$740M"
              href="https://www.empireco.ca"
            />
            <SourceLink
              company="Metro Inc."
              fiscal="FY2024 · Revenue CA$21.2B"
              href="https://corpo.metro.ca/en/investor-relations.html"
            />
          </ul>
          <p className="text-xs italic text-[var(--ink-soft)]">
            Market share (~80%) reflects widely cited estimates for the
            combined grocery retail footprint of Loblaw, Empire and Metro in
            Canada, alongside Walmart Canada and Costco Canada who hold most of
            the remainder. Figures are rounded; consult the linked filings for
            exact numbers and accounting notes.
          </p>
        </div>
      </section>
    </div>
  );
}

function BigStat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "ink" | "tomato" | "forest";
}) {
  const color =
    tone === "tomato" ? "#D94F30" : tone === "forest" ? "#3A5A40" : "var(--ink)";
  return (
    <div className="rounded-[24px] border border-[color:var(--border)] bg-[var(--surface)] p-5 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">
        {label}
      </p>
      <p
        className="mt-2 font-display text-4xl leading-none sm:text-5xl"
        style={{ color }}
      >
        {value}
      </p>
      <p className="mt-2 text-xs text-[var(--ink-soft)]">{sub}</p>
    </div>
  );
}

function SourceLink({
  company,
  fiscal,
  href,
}: {
  company: string;
  fiscal: string;
  href: string;
}) {
  return (
    <li className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] p-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block space-y-1"
      >
        <span className="block text-sm font-semibold text-[var(--ink)] underline-offset-4 hover:underline">
          {company} →
        </span>
        <span className="block text-xs text-[var(--ink-soft)]">{fiscal}</span>
      </a>
    </li>
  );
}
