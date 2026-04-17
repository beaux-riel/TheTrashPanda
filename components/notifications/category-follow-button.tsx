"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useHarvestLink } from "@/hooks/use-harvestlink";

export function CategoryFollowButton({ category }: { category: string }) {
  const { isFollowingCategory, toggleCategoryFollow } = useHarvestLink();
  const [animate, setAnimate] = useState(false);
  const following = isFollowingCategory(category);

  return (
    <Button
      className={animate ? "motion-safe:animate-peek" : undefined}
      variant={following ? "secondary" : "primary"}
      onClick={() => {
        setAnimate(true);
        toggleCategoryFollow(category);
        window.setTimeout(() => setAnimate(false), 500);
      }}
    >
      {following ? `Watching ${category}` : `Follow ${category}`}
    </Button>
  );
}
