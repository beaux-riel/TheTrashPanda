import type { TrustTier } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";

type TrustBadgeProps = {
  tier: TrustTier;
  variant?: "full" | "compact";
  className?: string;
};

type TierMeta = {
  emoji: string;
  label: string;
  shortLabel: string;
  bg: string;
  text: string;
};

const TIERS: Record<TrustTier, TierMeta> = {
  new: {
    emoji: "🌱",
    label: "New neighbour",
    shortLabel: "New neighbour",
    bg: "bg-[rgba(95,86,77,0.12)]",
    text: "text-[var(--ink-soft)]"
  },
  trusted: {
    emoji: "⭐",
    label: "Trusted contributor",
    shortLabel: "Trusted contributor",
    bg: "bg-[rgba(218,165,32,0.18)]",
    text: "text-[var(--honey)]"
  },
  verified: {
    emoji: "✅",
    label: "Verified — this is their profile",
    shortLabel: "Verified",
    bg: "bg-[rgba(58,90,64,0.16)]",
    text: "text-[var(--forest)]"
  }
};

export function TrustBadge({ tier, variant = "full", className }: TrustBadgeProps) {
  const meta = TIERS[tier];

  if (variant === "compact") {
    return (
      <span
        title={meta.label}
        aria-label={meta.label}
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm",
          meta.bg,
          className
        )}
      >
        <span aria-hidden="true">{meta.emoji}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        meta.bg,
        meta.text,
        className
      )}
    >
      <span aria-hidden="true">{meta.emoji}</span>
      <span>{meta.label}</span>
    </span>
  );
}
