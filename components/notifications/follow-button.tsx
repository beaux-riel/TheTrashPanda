"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useHarvestLink } from "@/hooks/use-harvestlink";

export function FollowButton({ producerId, producerName }: { producerId: string; producerName: string }) {
  const { isFollowingProducer, toggleProducerFollow } = useHarvestLink();
  const [busy, setBusy] = useState(false);
  const following = isFollowingProducer(producerId);

  return (
    <Button
      className={busy ? "motion-safe:animate-peek" : undefined}
      disabled={busy}
      onClick={() => {
        if (busy) return;
        if (following && !window.confirm(`Stop following ${producerName}? You won't get nudges when they post.`)) {
          return;
        }

        setBusy(true);
        toggleProducerFollow(producerId);
        // Quick debounce — the optimistic toggle is synchronous; the DB call
        // races behind it. 500ms is enough to absorb a double-click.
        window.setTimeout(() => setBusy(false), 500);
      }}
    >
      {following ? "Following ✓" : "Follow this producer"}
    </Button>
  );
}
