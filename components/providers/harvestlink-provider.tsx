"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

import {
  buildCommunitySnapshot,
  followerPreview,
  getListingById,
  getListingProducer,
  getProducerBySlug,
  initialFollows,
  initialNotifications,
  initialSchedule,
  listings as mockListings,
  producers as mockProducers,
  type Follow,
  type Listing,
  type NotificationFrequency,
  type NotificationItem,
  type PermissionState,
  type ScheduleSlot
} from "@/lib/data/mock";
import { fetchListingsClient, fetchProducersClient } from "@/lib/data/client-bridge";
import { useAuth } from "@/lib/auth/auth-provider";
import {
  createListingClient,
  getFollowsClient,
  getNotificationsClient,
  markListingGoneClient,
  markNotificationReadClient,
  toggleFollowClient
} from "@/lib/supabase/client-queries";
import type { FollowRow, NotificationRow } from "@/lib/supabase/types";
import {
  createCategoryNotificationCopy,
  createProducerNotificationCopy
} from "@/lib/notifications/copy";
import {
  registerForPush,
  requestNotificationPermission,
  showBrowserNotification
} from "@/lib/notifications/push";
import { getSeasonFromDate } from "@/lib/utils/season";

type PromptContext = {
  producerName?: string;
} | null;

type HarvestLinkContextValue = {
  season: ReturnType<typeof getSeasonFromDate>;
  producers: typeof mockProducers;
  listings: Listing[];
  follows: Follow[];
  notifications: NotificationItem[];
  schedule: ScheduleSlot[];
  followerPreview: typeof followerPreview;
  notificationPermission: PermissionState;
  unreadCount: number;
  promptContext: PromptContext;
  celebrationMessage: string | null;
  loginRequired: boolean;
  dashboardProducer: (typeof mockProducers)[0];
  communitySnapshot: ReturnType<typeof buildCommunitySnapshot>;
  isFollowingProducer: (producerId: string) => boolean;
  isFollowingCategory: (category: string) => boolean;
  toggleProducerFollow: (producerId: string) => void;
  toggleCategoryFollow: (category: string) => void;
  updateFollowPreference: (followId: string, frequency: NotificationFrequency) => void;
  toggleMuteFollow: (followId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  dismissPrompt: () => void;
  dismissLoginRequired: () => void;
  requestPushAccess: () => Promise<void>;
  sendTestNotification: (listingId: string) => void;
  markListingGone: (listingId: string) => void;
  repostListing: (listingId: string) => void;
  quickPostListing: (templateId?: string) => void;
  updateSchedule: (day: string, label: string, open: boolean) => void;
  dismissCelebration: () => void;
};

const HarvestLinkContext = createContext<HarvestLinkContextValue | null>(null);

const FOLLOWS_KEY = "thetrashpanda.follows";
const NOTIFICATIONS_KEY = "thetrashpanda.notifications";
const LISTINGS_KEY = "thetrashpanda.dashboardListings";
const SCHEDULE_KEY = "thetrashpanda.schedule";

function readStoredState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const stored = window.localStorage.getItem(key);
  if (!stored) {
    return fallback;
  }

  try {
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

function writeStoredState<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function adaptFollowRow(row: FollowRow, producerName?: string): Follow {
  const label =
    row.follow_type === "producer"
      ? producerName ?? "Producer"
      : row.follow_type === "category"
      ? row.category ?? "Category"
      : "Watched area";
  return {
    id: row.id,
    type: row.follow_type,
    label,
    producerId: row.producer_id ?? undefined,
    category: row.category ?? undefined,
    radiusKm: row.area_radius_km ?? undefined,
    frequency: row.frequency,
    muted: row.muted
  };
}

function adaptNotificationRow(row: NotificationRow): NotificationItem {
  return {
    id: row.id,
    title: row.title,
    body: row.body ?? "",
    href: row.href ?? "#",
    createdAt: new Date(row.created_at).toLocaleString(),
    unread: row.unread,
    kind: row.kind
  };
}

export function HarvestLinkProvider({ children }: { children: ReactNode }) {
  const { user, isConfigured } = useAuth();
  const [follows, setFollows] = useState<Follow[]>(initialFollows);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [dashboardListings, setDashboardListings] = useState<Listing[]>(mockListings);
  const [allProducers, setAllProducers] = useState(mockProducers);
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(initialSchedule);
  const [notificationPermission, setNotificationPermission] = useState<PermissionState>("default");
  const [promptContext, setPromptContext] = useState<PromptContext>(null);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
  const [loginRequired, setLoginRequired] = useState(false);

  useEffect(() => {
    setFollows(readStoredState(FOLLOWS_KEY, initialFollows));
    setNotifications(readStoredState(NOTIFICATIONS_KEY, initialNotifications));
    setDashboardListings(readStoredState(LISTINGS_KEY, mockListings));
    setSchedule(readStoredState(SCHEDULE_KEY, initialSchedule));

    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    } else {
      setNotificationPermission("unsupported");
    }

    // Fetch live data from Supabase (falls back to mock via client-bridge)
    fetchListingsClient().then((live) => {
      if (live.length > 0) {
        setDashboardListings(live);
        writeStoredState(LISTINGS_KEY, live);
      }
    }).catch(() => { /* mock data already loaded */ });

    fetchProducersClient().then((live) => {
      if (live.length > 0) setAllProducers(live);
    }).catch(() => { /* mock data already loaded */ });
  }, []);

  // Hydrate the authed user's follows + notifications from Supabase on sign-in.
  useEffect(() => {
    if (!isConfigured || !user) return;
    let cancelled = false;

    void (async () => {
      try {
        const [followRows, notificationRows] = await Promise.all([
          getFollowsClient(user.id),
          getNotificationsClient(user.id)
        ]);
        if (cancelled) return;
        const producerNameById = new Map(allProducers.map((p) => [p.id, p.name]));
        setFollows(
          followRows.map((row) =>
            adaptFollowRow(row, row.producer_id ? producerNameById.get(row.producer_id) : undefined)
          )
        );
        setNotifications((notificationRows as NotificationRow[]).map(adaptNotificationRow));
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("[HarvestLinkProvider] hydrate failed", err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isConfigured, user, allProducers]);

  useEffect(() => {
    writeStoredState(FOLLOWS_KEY, follows);
  }, [follows]);

  useEffect(() => {
    writeStoredState(NOTIFICATIONS_KEY, notifications);
  }, [notifications]);

  useEffect(() => {
    writeStoredState(LISTINGS_KEY, dashboardListings);
  }, [dashboardListings]);

  useEffect(() => {
    writeStoredState(SCHEDULE_KEY, schedule);
  }, [schedule]);

  const unreadCount = notifications.filter((item) => item.unread).length;
  const dashboardProducer = allProducers[0];

  const value = useMemo<HarvestLinkContextValue>(
    () => ({
      season: getSeasonFromDate(),
      producers: allProducers,
      listings: dashboardListings,
      follows,
      notifications,
      schedule,
      followerPreview,
      notificationPermission,
      unreadCount,
      promptContext,
      celebrationMessage,
      loginRequired,
      dashboardProducer,
      communitySnapshot: buildCommunitySnapshot(),
      isFollowingProducer: (producerId) => follows.some((follow) => follow.producerId === producerId),
      isFollowingCategory: (category) =>
        follows.some((follow) => follow.category?.toLowerCase() === category.toLowerCase()),
      toggleProducerFollow: (producerId) => {
        const producer = allProducers.find((item) => item.id === producerId);
        if (!producer) {
          return;
        }

        if (isConfigured && !user) {
          setLoginRequired(true);
          return;
        }

        const existing = follows.find((follow) => follow.producerId === producerId);
        const tempId = `follow-${producerId}`;

        startTransition(() => {
          if (existing) {
            setFollows((current) => current.filter((follow) => follow.id !== existing.id));
            setCelebrationMessage(`Quieted ${producer.name} for now. No hard feelings, just fewer pings.`);
          } else {
            setFollows((current) => [
              {
                id: tempId,
                type: "producer",
                label: producer.name,
                producerId,
                frequency: "immediate",
                muted: false
              },
              ...current
            ]);
            setPromptContext({ producerName: producer.name });
            setCelebrationMessage(`${producer.name} is in your loop now. Bandit approves the excellent taste.`);
          }
        });

        if (isConfigured && user) {
          void toggleFollowClient(user.id, { type: "producer", producerId })
            .then((result) => {
              if (result.action === "added" && result.row) {
                setFollows((current) =>
                  current.map((f) => (f.id === tempId ? adaptFollowRow(result.row!, producer.name) : f))
                );
              }
            })
            .catch((err) => {
              if (process.env.NODE_ENV === "development") {
                console.error("[toggleProducerFollow] Supabase failed", err);
              }
            });
        }
      },
      toggleCategoryFollow: (category) => {
        if (isConfigured && !user) {
          setLoginRequired(true);
          return;
        }

        const existing = follows.find((follow) => follow.category === category);
        const tempId = `category-${category.toLowerCase()}`;

        startTransition(() => {
          if (existing) {
            setFollows((current) => current.filter((follow) => follow.id !== existing.id));
            setCelebrationMessage(`${category} watch switched off. Your phone can exhale.`);
          } else {
            setFollows((current) => [
              {
                id: tempId,
                type: "category",
                label: category,
                category,
                frequency: "daily",
                muted: false
              },
              ...current
            ]);
            setCelebrationMessage(`${category} joined your watch list. If eggs pop up, you’ll hear about it.`);
          }
        });

        if (isConfigured && user) {
          void toggleFollowClient(user.id, { type: "category", category })
            .then((result) => {
              if (result.action === "added" && result.row) {
                setFollows((current) =>
                  current.map((f) => (f.id === tempId ? adaptFollowRow(result.row!) : f))
                );
              }
            })
            .catch((err) => {
              if (process.env.NODE_ENV === "development") {
                console.error("[toggleCategoryFollow] Supabase failed", err);
              }
            });
        }
      },
      updateFollowPreference: (followId, frequency) => {
        setFollows((current) =>
          current.map((follow) =>
            follow.id === followId
              ? {
                  ...follow,
                  frequency
                }
              : follow
          )
        );
      },
      toggleMuteFollow: (followId) => {
        setFollows((current) =>
          current.map((follow) =>
            follow.id === followId
              ? {
                  ...follow,
                  muted: !follow.muted
                }
              : follow
          )
        );
      },
      markNotificationRead: (notificationId) => {
        setNotifications((current) =>
          current.map((notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  unread: false
                }
              : notification
          )
        );
        if (isConfigured && user) {
          void markNotificationReadClient(notificationId).catch((err) => {
            if (process.env.NODE_ENV === "development") {
              console.error("[markNotificationRead] Supabase failed", err);
            }
          });
        }
      },
      markAllNotificationsRead: () => {
        const unreadIds = notifications.filter((n) => n.unread).map((n) => n.id);
        setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })));
        if (isConfigured && user) {
          unreadIds.forEach((id) => {
            void markNotificationReadClient(id).catch((err) => {
              if (process.env.NODE_ENV === "development") {
                console.error("[markAllNotificationsRead] Supabase failed", err);
              }
            });
          });
        }
      },
      dismissPrompt: () => setPromptContext(null),
      dismissLoginRequired: () => setLoginRequired(false),
      requestPushAccess: async () => {
        const permission = await requestNotificationPermission();
        setNotificationPermission(permission);

        if (permission === "granted") {
          await registerForPush();
          setPromptContext(null);
          setCelebrationMessage("Notifications are on. You’re officially the first to know when the good stuff lands.");
        }
      },
      sendTestNotification: (listingId) => {
        const listing = getListingById(listingId);
        if (!listing) {
          return;
        }

        const producer = getListingProducer(listing);
        if (!producer) {
          return;
        }

        const copy = createProducerNotificationCopy(producer, listing);
        const nextNotification: NotificationItem = {
          id: `notif-${Date.now()}`,
          title: copy.title,
          body: copy.body,
          href: `/listing/${listing.id}`,
          createdAt: "just now",
          unread: true,
          kind: "producer"
        };

        setNotifications((current) => [nextNotification, ...current]);
        showBrowserNotification(nextNotification.title, nextNotification.body, nextNotification.href);
      },
      markListingGone: (listingId) => {
        if (isConfigured && !user) {
          setLoginRequired(true);
          return;
        }

        setDashboardListings((current) =>
          current.map((listing) =>
            listing.id === listingId
              ? {
                  ...listing,
                  status: "gone"
                }
              : listing
          )
        );
        setCelebrationMessage("Marked gone. Short, sweet, and no one has to wonder if the eggs vanished.");

        if (isConfigured && user) {
          void markListingGoneClient(listingId).catch((err) => {
            if (process.env.NODE_ENV === "development") {
              console.error("[markListingGone] Supabase failed", err);
            }
          });
        }
      },
      repostListing: (listingId) => {
        const listing = dashboardListings.find((l) => l.id === listingId) ?? getListingById(listingId);
        if (!listing) {
          return;
        }

        const producer =
          allProducers.find((p) => p.id === listing.producerId) ?? getListingProducer(listing);
        if (!producer) {
          return;
        }

        if (isConfigured && !user) {
          setLoginRequired(true);
          return;
        }

        if (isConfigured && user) {
          void createListingClient({
            producer_id: user.id,
            title: listing.title,
            description: listing.description || null,
            category: listing.category,
            quantity: listing.quantity,
            price_label: listing.priceLabel,
            location_label: listing.locationLabel,
            photos: [],
            lng: listing.lng || undefined,
            lat: listing.lat || undefined
          })
            .then((row) => {
              if (!row) return;
              const revived: Listing = {
                ...listing,
                id: row.id,
                postedLabel: "posted just now",
                postedAt: row.created_at,
                status: "active",
                availableUntil: "7 days from now"
              };
              setDashboardListings((current) => [revived, ...current]);
              const copy = createCategoryNotificationCopy(revived.category, revived, producer);
              setNotifications((current) => [
                {
                  id: `notif-${Date.now() + 1}`,
                  title: copy.title,
                  body: copy.body,
                  href: `/listing/${revived.id}`,
                  createdAt: "just now",
                  unread: true,
                  kind: "category"
                },
                ...current
              ]);
              setCelebrationMessage(`Reposted ${listing.title}. Nice little encore.`);
            })
            .catch((err) => {
              if (process.env.NODE_ENV === "development") {
                console.error("[repostListing] Supabase failed", err);
              }
              setCelebrationMessage("Repost didn't stick — give it another go.");
            });
          return;
        }

        // Unconfigured fallback: local-only optimistic repost.
        const revived: Listing = {
          ...listing,
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `listing-${Date.now()}`,
          postedLabel: "posted just now",
          postedAt: new Date().toISOString(),
          status: "active",
          availableUntil: "7 days from now"
        };

        setDashboardListings((current) => [revived, ...current]);
        const copy = createCategoryNotificationCopy(revived.category, revived, producer);
        setNotifications((current) => [
          {
            id: `notif-${Date.now() + 1}`,
            title: copy.title,
            body: copy.body,
            href: `/listing/${revived.id}`,
            createdAt: "just now",
            unread: true,
            kind: "category"
          },
          ...current
        ]);
        setCelebrationMessage(`Reposted ${listing.title}. Nice little encore.`);
      },
      quickPostListing: (templateId) => {
        const template = templateId ? getListingById(templateId) : getListingById("listing-eggs");
        if (!template) {
          return;
        }

        const freshPost: Listing = {
          ...template,
          id: `listing-${Date.now()}`,
          status: "active",
          postedLabel: "posted just now",
          postedAt: new Date().toISOString(),
          views: 0,
          availableUntil: "7 days from now"
        };

        setDashboardListings((current) => [freshPost, ...current]);
        setCelebrationMessage("Posted! Bandit did a quick two-step behind the compost bin.");
      },
      updateSchedule: (day, label, open) => {
        setSchedule((current) =>
          current.map((slot) =>
            slot.day === day
              ? {
                  ...slot,
                  label,
                  open
                }
              : slot
          )
        );
      },
      dismissCelebration: () => setCelebrationMessage(null)
    }),
    [
      allProducers,
      celebrationMessage,
      dashboardListings,
      follows,
      isConfigured,
      loginRequired,
      notificationPermission,
      notifications,
      promptContext,
      schedule,
      dashboardProducer,
      unreadCount,
      user
    ]
  );

  return <HarvestLinkContext.Provider value={value}>{children}</HarvestLinkContext.Provider>;
}

export function useHarvestLink() {
  const context = useContext(HarvestLinkContext);

  if (!context) {
    throw new Error("useHarvestLink must be used inside HarvestLinkProvider.");
  }

  return context;
}

export function useProducerBySlug(slug: string) {
  return getProducerBySlug(slug);
}
