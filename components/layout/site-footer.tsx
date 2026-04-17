import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:rgba(245,240,232,0.6)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src="/images/bandit/street.webp"
              alt="Bandit the River City Trash Panda"
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>
          <div>
            <p className="font-display text-lg text-[var(--ink)]">
              Built by trash pandas, for neighbours.
            </p>
            <p className="text-xs text-[var(--ink-soft)]">
              Open source under MIT. Your food network belongs to you.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--ink-soft)]">
          <Link href="https://github.com/beaux-riel/HarvestLink" className="hover:text-[var(--accent)] transition">
            GitHub
          </Link>
          <span>·</span>
          <Link href="/about" className="hover:text-[var(--accent)] transition">
            About
          </Link>
          <span>·</span>
          <Link href="/about/bandit" className="hover:text-[var(--accent)] transition">
            Meet Bandit
          </Link>
          <span>·</span>
          <span>© {year} The Trash Panda</span>
          <span>·</span>
          <span className="italic">Powell River, BC 🇨🇦</span>
        </div>
      </div>
    </footer>
  );
}
