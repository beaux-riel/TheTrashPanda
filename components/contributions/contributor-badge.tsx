import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type ContributorBadgeProps = {
  displayName: string;
  href?: string;
  className?: string;
};

export function ContributorBadge({ displayName, href, className }: ContributorBadgeProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-[rgba(58,90,64,0.12)] px-3 py-1 text-xs font-semibold text-[var(--forest)]",
        className
      )}
    >
      <span aria-hidden="true">👀</span>
      <span>
        Spotted by <span className="font-bold">{displayName}</span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="transition hover:opacity-80">
        {content}
      </Link>
    );
  }

  return content;
}
