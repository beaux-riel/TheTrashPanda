"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { seasonLabels } from "@/lib/utils/season";
import { useHarvestLink } from "@/hooks/use-harvestlink";

const navItems = [
  { href: "/", label: "Map-ish" },
  { href: "/about/bandit", label: "Meet Bandit" },
  { href: "/onboarding", label: "Start here" },
  { href: "/notifications", label: "Bell" },
  { href: "/dashboard", label: "Producer den" },
  { href: "/settings/notifications", label: "Pings" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { season, unreadCount } = useHarvestLink();

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:rgba(245,240,232,0.88)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image
                src="/images/bandit/hero-tomato.webp"
                alt="Bandit"
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <div>
              <span className="font-display text-3xl text-[var(--ink)]">
                The Trash Panda
              </span>
              <p className="text-sm text-[var(--ink-soft)]">Powell River&apos;s neighbour-powered food loop.</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Badge tone="gold">{seasonLabels[season]}</Badge>
            <Badge tone={unreadCount ? "accent" : "neutral"}>
              {unreadCount ? `${unreadCount} fresh ping${unreadCount === 1 ? "" : "s"}` : "Quiet for now"}
            </Badge>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  active ? "bg-[var(--accent)] text-[var(--accent-ink)]" : "bg-[var(--surface)] text-[var(--ink-soft)]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
