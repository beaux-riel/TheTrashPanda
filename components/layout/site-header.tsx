"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { seasonLabels } from "@/lib/utils/season";
import { useHarvestLink } from "@/hooks/use-harvestlink";

const navItems = [
  { href: "/", label: "Explore", icon: "🗺️" },
  { href: "/producers", label: "Producers", icon: "🌱" },
  { href: "/about/bandit", label: "Meet Bandit", icon: "🦝" },
  { href: "/onboarding", label: "Get Started", icon: "👋" },
  { href: "/notifications", label: "Notifications", icon: "🔔", showBadge: true },
  { href: "/dashboard", label: "Dashboard", icon: "📋" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { season, unreadCount } = useHarvestLink();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:rgba(245,240,232,0.92)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="relative h-9 w-9 flex-shrink-0 sm:h-10 sm:w-10">
            <Image
              src="/images/bandit/hero-tomato.webp"
              alt="Bandit"
              fill
              className="object-contain"
              sizes="40px"
            />
          </div>
          <div>
            <span className="font-display text-xl text-[var(--ink)] sm:text-2xl lg:text-3xl">
              The Trash Panda
            </span>
            <p className="hidden text-xs text-[var(--ink-soft)] sm:block">
              Powell River&apos;s food loop
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                    : "text-[var(--ink-soft)] hover:bg-[var(--surface-strong)]"
                )}
              >
                {item.label}
                {item.showBadge && unreadCount > 0 && (
                  <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
          <Badge tone="gold" className="ml-2">{seasonLabels[season]}</Badge>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--ink)] transition hover:bg-[var(--surface-strong)] md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileMenuOpen ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <nav className="border-t border-[color:var(--border)] bg-[color:rgba(245,240,232,0.96)] px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition",
                    active
                      ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                      : "text-[var(--ink)] hover:bg-[var(--surface-strong)]"
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                  {item.showBadge && unreadCount > 0 && (
                    <span className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-xs text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="mt-3 flex gap-2 px-4">
            <Badge tone="gold">{seasonLabels[season]}</Badge>
          </div>
        </nav>
      )}
    </header>
  );
}
