"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHarvestLink } from "@/hooks/use-harvestlink";

export function PermissionBanner() {
  const { notificationPermission, promptContext, dismissPrompt, requestPushAccess } = useHarvestLink();

  if (!promptContext || notificationPermission === "granted" || notificationPermission === "unsupported") {
    return null;
  }

  return (
    <Card className="mx-auto flex max-w-7xl flex-col gap-3 border-[color:rgba(217,79,48,0.32)] bg-[color:rgba(217,79,48,0.08)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div>
        <p className="font-semibold text-[var(--ink)]">
          Want to know when {promptContext.producerName ?? "your favourites"} posts?
        </p>
        <p className="text-sm text-[var(--ink-soft)]">
          Turn on notifications and Bandit will holler when something good lands. If you say no, we&apos;ll keep it in-app and stay civil.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={dismissPrompt}>
          Maybe later
        </Button>
        <Button onClick={() => void requestPushAccess()}>Let Bandit holler</Button>
      </div>
    </Card>
  );
}
