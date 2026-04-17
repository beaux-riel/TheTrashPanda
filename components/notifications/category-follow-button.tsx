"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useHarvestLink } from "@/hooks/use-harvestlink";

export function CategoryFollowButton({ category }: { category: string }) {
  const { isFollowingCategory, toggleCategoryFollow } = useHarvestLink();
  const [busy, setBusy] = useState(false);
  const following = isFollowingCategory(category);

  return (
    <Button
      className={busy ? "motion-safe:animate-peek" : undefined}
      variant={following ? "secondary" : "primary"}
      disabled={busy}
      onClick={() => {
        if (busy) return;
        setBusy(true);
        toggleCategoryFollow(category);
        window.setTimeout(() => setBusy(false), 500);
      }}
    >
      {following ? `Watching ${category}` : `Follow ${category}`}
    </Button>
  );
}
