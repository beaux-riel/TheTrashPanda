"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NotificationCentre } from "@/components/notifications/notification-centre";
import { useHarvestLink } from "@/hooks/use-harvestlink";

export default function NotificationsPage() {
  const { notificationPermission, requestPushAccess, sendTestNotification } = useHarvestLink();

  return (
    <div className="space-y-6 py-4">
      <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="relative hidden h-20 w-20 flex-shrink-0 sm:block">
            <Image
              src="/images/bandit/night-prowl.webp"
              alt="Bandit prowling for notifications"
              fill
              className="object-contain"
              sizes="80px"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge tone={notificationPermission === "granted" ? "forest" : "accent"}>
                Browser access: {notificationPermission}
              </Badge>
            </div>
            <h1 className="font-display text-4xl text-[var(--ink)]">The bell, the nudges, the whole trash panda orchestra.</h1>
            <p className="max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
              Push notifications ask politely after a meaningful action, fall back to in-app if denied, and keep the copy warm instead of sounding like a bank alert.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => void requestPushAccess()}>
            Turn on browser notifications
          </Button>
          <Button onClick={() => sendTestNotification("listing-eggs")}>Send a test ping</Button>
        </div>
      </Card>
      <NotificationCentre />
    </div>
  );
}
