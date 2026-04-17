"use client";

import { useEffect } from "react";

import { BanditIllustration } from "@/components/brand/bandit-illustration";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHarvestLink } from "@/hooks/use-harvestlink";

export function CelebrationToast() {
  const { celebrationMessage, dismissCelebration } = useHarvestLink();

  useEffect(() => {
    if (!celebrationMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => dismissCelebration(), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [celebrationMessage, dismissCelebration]);

  if (!celebrationMessage) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-40 sm:left-auto sm:right-6 sm:w-[420px]">
      <Card className="pointer-events-auto flex items-center gap-4 border-[color:rgba(218,165,32,0.35)] bg-[color:rgba(245,240,232,0.98)] motion-safe:animate-pop">
        <BanditIllustration variant="summer" className="max-w-[84px]" />
        <div className="flex-1">
          <p className="font-semibold text-[var(--ink)]">Neighbourhood update</p>
          <p className="text-sm leading-6 text-[var(--ink-soft)]">{celebrationMessage}</p>
        </div>
        <Button variant="ghost" onClick={dismissCelebration}>
          Close
        </Button>
      </Card>
    </div>
  );
}
