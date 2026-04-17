import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "accent" | "forest" | "gold";
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tone === "neutral" && "bg-[var(--surface-strong)] text-[var(--ink-soft)]",
        tone === "accent" && "bg-[color:color-mix(in_srgb,var(--accent)_16%,white)] text-[var(--ink)]",
        tone === "forest" && "bg-[rgba(58,90,64,0.14)] text-[var(--forest)]",
        tone === "gold" && "bg-[rgba(218,165,32,0.16)] text-[var(--honey)]",
        className
      )}
      {...props}
    />
  );
}
