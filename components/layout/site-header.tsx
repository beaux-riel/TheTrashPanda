"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { seasonLabels } from "@/lib/utils/season";
import { useHarvestLink } from "@/hooks/use-harvestlink";
import { useAuth } from "@/lib/auth/auth-provider";

type NavItem = { href: string; label: string; icon: string; showBadge?: boolean };

const publicNav: NavItem[] = [
  { href: "/", label: "Explore", icon: "🗺️" },
  { href: "/producers", label: "Neighbours", icon: "🌱" },
  { href: "/the-squeeze", label: "The Squeeze", icon: "💰" },
  { href: "/about/bandit", label: "Meet Bandit 🦝", icon: "🦝" }
];

const authenticatedNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "📋" },
  { href: "/dashboard/reviews", label: "Reviews", icon: "✅" },
  { href: "/notifications", label: "Notifications", icon: "🔔", showBadge: true }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { season, unreadCount } = useHarvestLink();
  const { user, profile, signOut, isConfigured } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loggedIn = Boolean(user);
  const navItems = loggedIn ? [...publicNav, ...authenticatedNav] : publicNav;
  const displayName =
    profile?.display_name?.trim() ||
    user?.user_metadata?.display_name ||
    user?.email ||
    "";

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:rgba(245,240,232,0.92)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div>
            <span className="font-display text-xl text-[var(--ink)] sm:text-2xl lg:text-3xl">
              The Trash Panda
            </span>
            <p className="hidden text-xs text-[var(--ink-soft)] sm:block">
              Community food loops across Canada
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

          {loggedIn ? (
            <div className="ml-2 flex items-center gap-2">
              <span className="max-w-[160px] truncate text-sm font-semibold text-[var(--ink)]">
                {displayName}
              </span>
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--ink-soft)] transition hover:bg-[var(--surface-strong)]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <Link
                href="/onboarding"
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-ink)] transition hover:opacity-90"
              >
                Get Started
              </Link>
              {isConfigured && (
                <Link
                  href="/auth/login"
                  className="rounded-full px-3.5 py-2 text-sm font-semibold text-[var(--ink-soft)] transition hover:bg-[var(--surface-strong)]"
                >
                  Sign in
                </Link>
              )}
            </div>
          )}

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

          <div className="mt-3 flex flex-col gap-2 border-t border-[color:var(--border)] pt-3">
            {loggedIn ? (
              <>
                <span className="px-2 text-xs uppercase tracking-wide text-[var(--ink-soft)]">
                  Signed in as
                </span>
                <span className="truncate px-2 text-sm font-semibold text-[var(--ink)]">
                  {displayName}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    void signOut();
                  }}
                  className="rounded-2xl bg-[var(--surface-strong)] px-4 py-3 text-left text-base font-semibold text-[var(--ink)] transition hover:opacity-90"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/onboarding"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl bg-[var(--accent)] px-4 py-3 text-base font-semibold text-[var(--accent-ink)]"
                >
                  Get Started
                </Link>
                {isConfigured && (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-2xl bg-[var(--surface-strong)] px-4 py-3 text-base font-semibold text-[var(--ink)]"
                  >
                    Sign in
                  </Link>
                )}
              </>
            )}
            <div className="px-2 pt-1">
              <Badge tone="gold">{seasonLabels[season]}</Badge>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
