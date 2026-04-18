import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type ClaimButtonProps = {
  producerId: string;
  triggerLabel?: string;
  triggerClassName?: string;
  variant?: "primary" | "secondary" | "ghost";
  /**
   * When true, adds a gentle glow + pulse to nudge the real producer toward
   * claiming. Used on community-maintained profile pages where the claim CTA
   * should stand out without screaming.
   */
  prominent?: boolean;
};

export function ClaimButton({
  producerId,
  triggerLabel = "This is me",
  triggerClassName,
  variant = "primary",
  prominent = false
}: ClaimButtonProps) {
  return (
    <Link
      href={`/claim/${producerId}`}
      className={cn(
        buttonStyles(variant),
        prominent &&
          "ring-2 ring-[color:color-mix(in_srgb,var(--accent)_50%,transparent)] ring-offset-2 ring-offset-[var(--page)] motion-safe:animate-[pulse_3s_ease-in-out_infinite]",
        triggerClassName
      )}
    >
      <span aria-hidden="true" className="mr-1.5">
        🦝
      </span>
      {triggerLabel}
    </Link>
  );
}
