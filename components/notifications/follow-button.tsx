"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useHarvestLink } from "@/hooks/use-harvestlink";

export function FollowButton({ producerId, producerName }: { producerId: string; producerName: string }) {
  const { isFollowingProducer, toggleProducerFollow } = useHarvestLink();
  const [animate, setAnimate] = useState(false);
  const following = isFollowingProducer(producerId);

  return (
    <Button
      className={animate ? "motion-safe:animate-peek" : undefined}
      onClick={() => {
        if (following && !window.confirm(`Stop following ${producerName}? You won't get nudges when they post.`)) {
          return;
        }

        setAnimate(true);
        toggleProducerFollow(producerId);
        window.setTimeout(() => setAnimate(false), 500);
      }}
    >
      {following ? "Following ✓" : "Follow this producer"}
    </Button>
  );
}
