import { cn } from "@/lib/utils/cn";

type CommunityBadgeProps = {
  onClaim?: () => void;
  showClaimLink?: boolean;
  className?: string;
};

export function CommunityBadge({ onClaim, showClaimLink = true, className }: CommunityBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-2 rounded-full bg-[rgba(218,165,32,0.14)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]",
        className
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true">🌱</span>
        Community-maintained
      </span>
      {showClaimLink ? (
        <button
          type="button"
          onClick={onClaim}
          className="text-[var(--forest)] underline-offset-2 transition hover:underline"
        >
          This is you? Claim it →
        </button>
      ) : null}
    </div>
  );
}
