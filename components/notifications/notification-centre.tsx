"use client";

import Link from "next/link";

import { EmptyState } from "@/components/brand/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHarvestLink } from "@/hooks/use-harvestlink";

export function NotificationCentre() {
  const { notifications, markAllNotificationsRead, markNotificationRead } = useHarvestLink();

  if (!notifications.length) {
    return (
      <EmptyState
        variant="empty"
        title="Nothing in the bell yet"
        body="Follow a few neighbours and Bandit will keep the loop warm without turning your phone into a tambourine."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-[var(--ink)]">Notification centre</h2>
          <p className="text-sm text-[var(--ink-soft)]">Freshest pings first. No corporate “engagement events,” just useful neighbourhood noise.</p>
        </div>
        <Button variant="secondary" onClick={markAllNotificationsRead}>
          Mark the whole pile read
        </Button>
      </div>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={notification.unread ? "border-[color:rgba(217,79,48,0.35)] bg-[color:rgba(255,255,255,0.82)]" : undefined}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={notification.unread ? "accent" : "neutral"}>
                    {notification.unread ? "Unread" : "Read"}
                  </Badge>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-soft)]">{notification.createdAt}</span>
                </div>
                <h3 className="font-display text-2xl text-[var(--ink)]">{notification.title}</h3>
                <p className="text-sm leading-6 text-[var(--ink-soft)]">{notification.body}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => markNotificationRead(notification.id)}>
                  Mark read
                </Button>
                <Link className={buttonStyles("secondary")} href={notification.href}>
                  Open it
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
