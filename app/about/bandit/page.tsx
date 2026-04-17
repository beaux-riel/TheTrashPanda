import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BanditIllustration } from "@/components/brand/bandit-illustration";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Meet Bandit",
  description:
    "Bandit is a trash panda. He finds treasure where others see waste, and food where others see surplus. This is his story.",
};

const banditRules = [
  { emoji: "🥕", rule: "Local food first. Always." },
  { emoji: "👋", rule: "Know your neighbour's name before you know their produce." },
  { emoji: "♻️", rule: "Surplus isn't waste — it's an invitation." },
  { emoji: "👀", rule: "The best food economy is invisible until you look." },
  { emoji: "⛴️", rule: "Ferry cancelled? Garden's still open." },
  { emoji: "🌙", rule: "The best stuff gets snagged after dark." },
  { emoji: "🤝", rule: "Never charge a neighbour more than they'd charge you." },
  { emoji: "🗑️", rule: "Trash panda is a compliment." },
];

const galleryVariants = [
  { src: "dawn-coffee.webp", label: "Dawn patrol", caption: "Even trash pandas need coffee before they forage." },
  { src: "morning-garden.webp", label: "Morning raid", caption: "Best stuff goes fast." },
  { src: "midday-market.webp", label: "Market hours", caption: "Peak operating conditions." },
  { src: "rain-boots.webp", label: "Rain shift", caption: "The garden doesn't close for weather." },
  { src: "storm-dramatic.webp", label: "Storm watch", caption: "Somebody's gotta guard the harvest." },
  { src: "night-prowl.webp", label: "Night ops", caption: "This is when the real work happens." },
  { src: "snow-cozy.webp", label: "Winter stash", caption: "Preserved goods season." },
  { src: "ferry-waiting.webp", label: "Ferry day", caption: "Waiting. Again." },
];

export default function BanditPage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero */}
      <section className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            The mascot. The myth. The trash panda.
          </p>
          <h1 className="font-display text-6xl leading-[1.1] text-[var(--ink)]">
            Meet Bandit.
          </h1>
          <p className="text-xl leading-9 text-[var(--ink-soft)]">
            He didn&apos;t ask for this job. He just showed up one night, 
            redistributed some zucchini, and never left.
          </p>
          <p className="text-lg leading-8 text-[var(--ink-soft)]">
            Now he runs the neighbourhood food network. Unofficially. 
            Without permission. The way all good things start.
          </p>
        </div>
        <div className="flex justify-center">
          <BanditIllustration variant="onboarding" priority className="max-w-[400px]" />
        </div>
      </section>

      {/* Origin Story */}
      <section className="rounded-[36px] border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.7)] p-8 shadow-card">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="font-display text-4xl text-[var(--ink)]">Origin Story</h2>
          
          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            <div className="space-y-4 text-lg leading-8 text-[var(--ink-soft)]">
              <p>
                Bandit grew up in the alleys behind the grocery stores of Powell River, 
                BC. Small town. Population 13,000. Accessible by ferry — when it runs.
              </p>
              <p>
                He watched the trucks come in. Every week, 27 of them, hauling food 
                from 1,400 kilometres away. Tomatoes from Mexico. Apples from Washington. 
                Bread from a factory in Surrey.
              </p>
              <p>
                Meanwhile, three blocks over, Mrs. Chen&apos;s garden was drowning in 
                zucchini. Dave on Maple Street had more eggs than his family could eat 
                in a month. The Townsite Garden Collective was composting perfectly good 
                kale because nobody came to pick it up.
              </p>
              <p className="font-semibold text-[var(--ink)]">
                The food was right there. The network was invisible.
              </p>
              <p>
                So Bandit did what trash pandas do. He started showing up. Raiding 
                gardens — not to steal, but to redistribute. Leaving tomatoes on 
                doorsteps. Connecting the lady with the sourdough to the guy with 
                the honey. Building a map that only he could see.
              </p>
              <p>
                The Robin Hood of root vegetables. The neighbourhood&apos;s unofficial 
                food network coordinator. Nobody asked him to do it.
              </p>
              <p className="italic text-[var(--accent)]">
                He just showed up.
              </p>
            </div>
            <div className="hidden lg:flex lg:flex-col lg:gap-4">
              <div className="relative h-48 w-48">
                <Image
                  src="/images/bandit/street.webp"
                  alt="Bandit on the streets"
                  fill
                  className="rounded-2xl object-contain"
                  sizes="192px"
                />
              </div>
              <div className="relative h-48 w-48">
                <Image
                  src="/images/bandit/bread-morning.webp"
                  alt="Bandit delivering bread"
                  fill
                  className="rounded-2xl object-contain"
                  sizes="192px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Name */}
      <section className="text-center space-y-6">
        <div className="relative mx-auto h-40 w-40">
          <Image
            src="/images/bandit/hero.webp"
            alt="Bandit standing proud"
            fill
            className="object-contain"
            sizes="160px"
          />
        </div>
        <blockquote className="mx-auto max-w-2xl">
          <p className="font-display text-3xl leading-snug text-[var(--ink)]">
            &ldquo;Some people call us raccoons. We prefer trash pandas. 
            We find treasure where others see waste. We see abundance 
            where others see surplus.&rdquo;
          </p>
        </blockquote>
        <p className="text-sm text-[var(--ink-soft)]">— Bandit, probably</p>
      </section>

      {/* Philosophy */}
      <section className="rounded-[36px] border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.7)] p-8 shadow-card">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="font-display text-4xl text-[var(--ink)]">
            Bandit&apos;s Philosophy
          </h2>
          <div className="space-y-4 text-lg leading-8 text-[var(--ink-soft)]">
            <p>
              If your neighbour has zucchini and you have eggs, that&apos;s not 
              charity — that&apos;s a neighbourhood.
            </p>
            <p>
              The grocery store model works until it doesn&apos;t. The ferry 
              gets cancelled. The supply chain hiccups. Fuel prices spike and 
              suddenly a head of lettuce costs $7.
            </p>
            <p>
              But the garden next door? That&apos;s still growing. The beekeeper 
              down the road? Still has honey. The sourdough lady? She baked this 
              morning, rain or shine.
            </p>
            <p className="font-semibold text-[var(--ink)]">
              Decentralised food isn&apos;t a philosophy. It&apos;s just 
              Tuesday in a small town — if you know where to look.
            </p>
            <p>
              Bandit knows where to look.
            </p>
          </div>
        </div>
      </section>

      {/* Bandit's Rules */}
      <section className="space-y-6">
        <h2 className="font-display text-4xl text-center text-[var(--ink)]">
          Bandit&apos;s Rules
        </h2>
        <p className="text-center text-[var(--ink-soft)]">
          Not a mission statement. Not company values. Just rules.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {banditRules.map((item, i) => (
            <Card key={i} className="space-y-2 text-center">
              <span className="text-3xl">{item.emoji}</span>
              <p className="text-sm font-semibold leading-6 text-[var(--ink)]">
                {item.rule}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="space-y-6">
        <h2 className="font-display text-4xl text-center text-[var(--ink)]">
          Bandit Through the Day
        </h2>
        <p className="text-center text-[var(--ink-soft)]">
          He changes with the weather and the hour. Because he actually lives here.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryVariants.map((v) => (
            <div key={v.src} className="group space-y-2">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--surface)]">
                <Image
                  src={`/images/bandit/${v.src}`}
                  alt={v.caption}
                  fill
                  className="object-contain p-2 transition group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 240px"
                />
              </div>
              <p className="text-sm font-semibold text-[var(--ink)]">{v.label}</p>
              <p className="text-xs italic text-[var(--ink-soft)]">{v.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-[36px] border border-[color:var(--border)] bg-[var(--accent)] p-10 text-center shadow-card">
        <div className="mx-auto max-w-xl space-y-4">
          <h2 className="font-display text-4xl text-white">
            Join the network
          </h2>
          <p className="text-lg leading-8 text-white/90">
            Bandit can&apos;t do this alone. Well, he could. But it&apos;d be 
            weird if just a trash panda showed up with your tomatoes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--accent)] transition hover:bg-white/90"
              href="/onboarding"
            >
              Start here
            </Link>
            <Link
              className="rounded-full border-2 border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              href="/"
            >
              See the map
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
