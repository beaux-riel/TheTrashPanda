import Link from "next/link";

import { ClaimButton } from "./claim-button";
import { CommunityBadge } from "./community-badge";

type ClaimSectionProps = {
  producerId: string;
  producerName: string;
};

export function ClaimSection({ producerId, producerName }: ClaimSectionProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CommunityBadge claimHref={`/claim/${producerId}`} />
      <ClaimButton
        producerId={producerId}
        variant="secondary"
        triggerLabel={`This is ${producerName.split(" ")[0] || "me"}`}
        prominent
      />
      <Link
        href={`/claim/${producerId}`}
        className="text-xs text-[var(--ink-soft)] underline-offset-2 hover:underline"
      >
        Learn more
      </Link>
    </div>
  );
}
